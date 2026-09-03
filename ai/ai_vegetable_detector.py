"""
SITAGARAA — AI Vegetable Detector
---------------------------------------------------------------------
Runs on a laptop or Raspberry Pi (NOT the ESP32 — it doesn't have the
compute power for a vision model). Pulls the MJPEG video stream from
your ESP32-CAM, runs a real YOLO detection on it, and writes the
GENUINE result to Firebase's /vegetableInfo — this replaces any
hardcoded/fake vegetable data.

Install:
    pip install ultralytics opencv-python requests

Before running:
    1. Flash esp32_sitagaraa.ino to your board and note the IP address
       it prints to Serial once connected to WiFi.
    2. Set ESP32_STREAM_URL below to that IP (matches CAMERA_STREAM_URL
       in script.js — keep both in sync).
    3. (Optional but recommended) Fine-tune a YOLOv8 model on a
       vegetable dataset for real vegetable classes — the stock
       yolov8n.pt only recognizes a handful of COCO food classes
       (banana, apple, orange, broccoli, carrot).
"""

import time
import json
from datetime import datetime, timezone

import cv2
import requests
from ultralytics import YOLO

# ---------------- USER CONFIG ----------------
ESP32_STREAM_URL = "http://192.168.1.50:81/stream"   # <-- your ESP32-CAM's IP (see Serial Monitor)

FIREBASE_HOST = "https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app"
FIREBASE_AUTH = ""   # optional database secret / ID token, or "" for open test rules

MODEL_PATH = "yolov8n.pt"       # swap for your fine-tuned vegetable weights
CONFIDENCE_THRESHOLD = 0.45
DETECT_INTERVAL_SEC = 5          # run inference every N seconds
# -----------------------------------------------

VEGETABLE_CLASSES = {
    "banana", "apple", "orange", "broccoli", "carrot",
    "tomato", "potato", "onion", "cabbage", "cucumber",
    "capsicum", "pepper", "chilli", "brinjal", "eggplant",
    "corn", "spinach", "cauliflower", "beans", "garlic", "lettuce"
}


def firebase_url(path: str) -> str:
    url = f"{FIREBASE_HOST}/{path}.json"
    if FIREBASE_AUTH:
        url += f"?auth={FIREBASE_AUTH}"
    return url


def fb_get(path: str):
    try:
        r = requests.get(firebase_url(path), timeout=5)
        if r.status_code == 200:
            return r.json()
    except requests.RequestException as e:
        print("Firebase GET error:", e)
    return None


def fb_patch(path: str, data: dict):
    try:
        r = requests.patch(firebase_url(path), data=json.dumps(data), timeout=5)
        return r.status_code == 200
    except requests.RequestException as e:
        print("Firebase PATCH error:", e)
        return False


def fb_put(path: str, data):
    try:
        r = requests.put(firebase_url(path), data=json.dumps(data), timeout=5)
        return r.status_code == 200
    except requests.RequestException as e:
        print("Firebase PUT error:", e)
        return False


def now_ms() -> int:
    return int(datetime.now(timezone.utc).timestamp() * 1000)


def get_or_init_storage_start() -> int:
    info = fb_get("vegetableInfo") or {}
    start = info.get("storageStartTime")
    if not start:
        start = now_ms()
        fb_patch("vegetableInfo", {"storageStartTime": start})
    return start


def days_between(start_ms: int) -> int:
    return max(0, (now_ms() - start_ms) // (1000 * 60 * 60 * 24))


def main():
    print("Loading YOLO model:", MODEL_PATH)
    model = YOLO(MODEL_PATH)

    print("Connecting to ESP32-CAM stream:", ESP32_STREAM_URL)
    cap = cv2.VideoCapture(ESP32_STREAM_URL)
    if not cap.isOpened():
        raise RuntimeError(
            "Could not open the ESP32-CAM stream. Check that the board is "
            "powered on, connected to the same WiFi network as this "
            "computer, and that ESP32_STREAM_URL matches its printed IP."
        )

    storage_start = get_or_init_storage_start()
    last_detect_time = 0

    print("AI vegetable detection running. Press Ctrl+C to stop.")
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Frame grab failed, retrying...")
                time.sleep(1)
                continue

            now = time.time()
            if now - last_detect_time >= DETECT_INTERVAL_SEC:
                last_detect_time = now

                results = model.predict(frame, verbose=False)[0]
                best_label, best_conf = None, 0.0

                for box in results.boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    label = model.names.get(cls_id, "unknown").lower()

                    if conf < CONFIDENCE_THRESHOLD:
                        continue
                    if label in VEGETABLE_CLASSES and conf > best_conf:
                        best_label, best_conf = label, conf
                    elif best_label is None and conf > best_conf:
                        best_label, best_conf = label, conf

                if best_label:
                    days = days_between(storage_start)
                    payload = {
                        "currentVegetable": best_label.capitalize(),
                        "confidence": round(best_conf, 3),
                        "detectedAt": now_ms(),
                        "storageStartTime": storage_start,
                        "daysStored": days,
                    }
                    ok = fb_patch("vegetableInfo", payload)
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] "
                          f"Detected: {best_label} ({best_conf:.2f})  "
                          f"day {days}  -> Firebase {'OK' if ok else 'FAILED'}")
                else:
                    fb_patch("vegetableInfo", {"daysStored": days_between(storage_start)})

            cv2.imshow("SITAGARAA - AI Vegetable Detector (press q to quit)", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        pass
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
