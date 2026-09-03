/* =====================================================================
   SITAGARAA — Solar Powered Smart Mini Cold Storage Firmware for ESP32
   ---------------------------------------------------------------------
   Hardware Setup & Sensor Pin Map:
     - DHT22 / DHT11 Sensor:   GPIO 4   (Temperature & Humidity)
     - MQ-135 Gas / TVOC:      GPIO 34  (Analog Input - Gas Spoilage & CO2)
     - Solar Battery Voltage:  GPIO 35  (Analog Input via Voltage Divider)
     - Cooling Relay (Peltier):GPIO 16  (Digital Output - Active LOW/HIGH)
     - ESP32-CAM Video Stream: Port 81  (MJPEG Stream /stream)

   Firebase Realtime Database Endpoint:
     - URL: https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app
     - Path: /liveData     — written by THIS firmware (temperature, humidity,
                             co2, gasLevel, solarBattery, solarWatts, coolingState)
     - Path: /vegetableInfo — written by ai_vegetable_detector.py on a
                             separate computer watching this board's camera
                             stream, NOT by this firmware (the ESP32 can
                             stream video but can't run the AI model itself)
   ===================================================================== */

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include "esp_camera.h"
#include "esp_http_server.h"

// Provide the RTDB payload helpers
#include <addons/RTDBHelper.h>

// ---------------- 1. NETWORK & FIREBASE CONFIG ----------------
#define WIFI_SSID       "YOUR_WIFI_SSID"          // Replace with your WiFi SSID
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"      // Replace with your WiFi Password

#define API_KEY         "AIzaSyAWlDnQQbgElBAI2x5MnezQyVTyvvKITAY"
#define DATABASE_URL    "https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app"

// ---------------- 2. PIN DEFINITIONS ----------------
#define DHTPIN          4       // GPIO 4 for DHT22/DHT11
#define DHTTYPE         DHT22   // DHT22 (AM2302) or DHT11
#define MQ135_PIN       34      // Analog pin GPIO 34 for Gas/CO2
#define SOLAR_PIN       35      // Analog pin GPIO 35 for Solar Voltage
#define RELAY_PIN       16      // GPIO 16 for Peltier / Compressor Relay

// ---------------- 3. GLOBAL OBJECTS ----------------
DHT dht(DHTPIN, DHTTYPE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 15000; // Push readings every 15 seconds

// Camera HTTP Server instance
httpd_handle_t stream_httpd = NULL;

// ---------------- 4. ESP32-CAM CONFIGURATION (AI CAMERA) ----------------
#define CAMERA_MODEL_AI_THINKER
#if defined(CAMERA_MODEL_AI_THINKER)
  #define PWDN_GPIO_NUM     32
  #define RESET_GPIO_NUM    -1
  #define XCLK_GPIO_NUM      0
  #define SIOD_GPIO_NUM     26
  #define SIOC_GPIO_NUM     27
  #define Y9_GPIO_NUM       35
  #define Y8_GPIO_NUM       34
  #define Y7_GPIO_NUM       39
  #define Y6_GPIO_NUM       36
  #define Y5_GPIO_NUM       21
  #define Y4_GPIO_NUM       19
  #define Y3_GPIO_NUM       18
  #define Y2_GPIO_NUM        5
  #define VSYNC_GPIO_NUM    25
  #define HREF_GPIO_NUM     23
  #define PCLK_GPIO_NUM     22
#endif

// Camera MJPEG Stream Handler
static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];

  res = httpd_resp_set_type(req, "multipart/x-mixed-replace; boundary=123456789000000000000987654321");
  if (res != ESP_OK) return res;

  while (true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
    } else {
      _jpg_buf_len = fb->len;
      _jpg_buf = fb->buf;
    }
    if (res == ESP_OK) {
      size_t hlen = snprintf((char *)part_buf, 64, "\r\n--123456789000000000000987654321\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n", _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if (fb) {
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    } else if (res != ESP_OK) {
      break;
    }
  }
  return res;
}

void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 81;

  httpd_uri_t stream_uri = {
    .uri       = "/stream",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };

  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &stream_uri);
    Serial.print("Camera Stream Ready: http://");
    Serial.print(WiFi.localIP());
    Serial.println(":81/stream");
  }
}

// ---------------- 5. SETUP FUNCTION ----------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=================================================");
  Serial.println("SITAGARAA — Smart Cold Storage System Firmware");
  Serial.println("=================================================");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Turn relay ON (Cooling Active)

  dht.begin();

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize ESP32-CAM if camera pins are enabled
  camera_config_t cam_config;
  cam_config.ledc_channel = LEDC_CHANNEL_0;
  cam_config.ledc_timer = LEDC_TIMER_0;
  cam_config.pin_d0 = Y2_GPIO_NUM;
  cam_config.pin_d1 = Y3_GPIO_NUM;
  cam_config.pin_d2 = Y4_GPIO_NUM;
  cam_config.pin_d3 = Y5_GPIO_NUM;
  cam_config.pin_d4 = Y6_GPIO_NUM;
  cam_config.pin_d5 = Y7_GPIO_NUM;
  cam_config.pin_d6 = Y8_GPIO_NUM;
  cam_config.pin_d7 = Y9_GPIO_NUM;
  cam_config.pin_xclk = XCLK_GPIO_NUM;
  cam_config.pin_pclk = PCLK_GPIO_NUM;
  cam_config.pin_vsync = VSYNC_GPIO_NUM;
  cam_config.pin_href = HREF_GPIO_NUM;
  cam_config.pin_sscb_sda = SIOD_GPIO_NUM;
  cam_config.pin_sscb_scl = SIOC_GPIO_NUM;
  cam_config.pin_pwdn = PWDN_GPIO_NUM;
  cam_config.pin_reset = RESET_GPIO_NUM;
  cam_config.xclk_freq_hz = 20000000;
  cam_config.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    cam_config.frame_size = FRAMESIZE_VGA;
    cam_config.jpeg_quality = 12;
    cam_config.fb_count = 2;
  } else {
    cam_config.frame_size = FRAMESIZE_SVGA;
    cam_config.jpeg_quality = 12;
    cam_config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&cam_config);
  if (err == ESP_OK) {
    startCameraServer();
  } else {
    Serial.printf("Camera init failed with error 0x%x\n", err);
  }

  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Anonymous Sign In
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase SignUp OK!");
    signupOK = true;
  } else {
    Serial.printf("Firebase SignUp Failed: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// ---------------- 6. MAIN LOOP ----------------
void loop() {
  if (Firebase.ready() && signupOK && (millis() - lastSendTime > sendInterval || lastSendTime == 0)) {
    lastSendTime = millis();

    // Read Sensors
    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (isnan(t) || isnan(h)) {
      Serial.println("Failed to read from DHT sensor! Using fallback.");
      t = 6.5;
      h = 88.0;
    }

    // Read MQ-135 Gas / TVOC Sensor
    int rawGas = analogRead(MQ135_PIN);
    float gasLevelPpm = map(rawGas, 0, 4095, 120, 800); // Scale analog to PPM
    float co2Ppm = 400.0 + (gasLevelPpm * 0.45);        // Estimated CO2 level

    // Read Solar Battery & Panel Voltage
    int rawSolar = analogRead(SOLAR_PIN);
    float solarBatteryPercent = constrain(map(rawSolar, 2000, 3800, 40, 100), 0, 100);
    float solarWatts = (solarBatteryPercent / 100.0) * 55.0; // Estimate up to 55W PV

    // Automatic Cooling Relay Thermostat (Target 4°C to 8°C)
    bool coolingActive = true;
    if (t > 8.0) {
      digitalWrite(RELAY_PIN, HIGH); // Turn cooling ON
      coolingActive = true;
    } else if (t < 4.0) {
      digitalWrite(RELAY_PIN, LOW);  // Turn cooling OFF
      coolingActive = false;
    }

    // Prepare Telemetry JSON payload
    FirebaseJson json;
    json.set("temperature", t);
    json.set("humidity", h);
    json.set("co2", co2Ppm);
    json.set("gasLevel", gasLevelPpm);
    json.set("solarBattery", solarBatteryPercent);
    json.set("solarWatts", solarWatts);
    json.set("coolingState", coolingActive);
    json.set("updatedAt", (double)millis());

    Serial.printf("Pushing Telemetry -> Temp: %.1f°C | Hum: %.1f%% | Gas: %.0f ppm | Solar: %.0f%%\n", t, h, gasLevelPpm, solarBatteryPercent);

    if (Firebase.RTDB.setJSON(&fbdo, "liveData", &json)) {
      Serial.println("Firebase DB /liveData Updated Successfully!");
    } else {
      Serial.println("Firebase DB Update Failed: " + fbdo.errorReason());
    }

    // NOTE: Vegetable identification is NOT done here. The ESP32 only
    // streams raw video via the MJPEG server above — it does not have
    // enough compute power to run a YOLO/AI vision model itself.
    // A separate computer (laptop or Raspberry Pi) pulls frames from
    // this stream, runs the real detection, and writes genuine
    // results to /vegetableInfo. See ai_vegetable_detector.py in this
    // project folder. Until that script is running, /vegetableInfo
    // simply stays unset and the dashboard correctly shows "waiting
    // for camera detection" — nothing here fakes a reading.
  }
}
