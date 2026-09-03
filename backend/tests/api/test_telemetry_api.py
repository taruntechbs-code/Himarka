from datetime import datetime, timezone
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_telemetry_ingest_flow(client: AsyncClient):
    payload = {
        "device_id": "ESP32-TEST-UNIT-1",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature_c": 3.8,
        "humidity_percent": 88.5,
        "gas_ppm": 145.0,
        "cooling_active": True,
        "door_open": False,
    }

    # 1. Ingest telemetry from unknown device should be REJECTED (Zero Trust IoT)
    rej_response = await client.post("/api/v1/telemetry/ingest", json=payload)
    assert rej_response.status_code == 404
    rej_data = rej_response.json()
    assert rej_data["error"]["code"] == "DEVICE_NOT_FOUND"

    # 2. Register the device
    reg_response = await client.post(
        "/api/v1/devices",
        json={"device_id": "ESP32-TEST-UNIT-1", "hardware_type": "ESP32-WROOM-32"},
    )
    assert reg_response.status_code == 201

    # 3. Ingest telemetry from registered device should now SUCCEED
    response = await client.post("/api/v1/telemetry/ingest", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["device_id"] == "ESP32-TEST-UNIT-1"
    assert res_data["data"]["temperature_c"] == 3.8

    # 4. Query latest telemetry
    latest_res = await client.get("/api/v1/telemetry/latest?device_id=ESP32-TEST-UNIT-1")
    assert latest_res.status_code == 200
    latest_data = latest_res.json()
    assert latest_data["success"] is True
    assert latest_data["data"]["temperature_c"] == 3.8

    # 5. Query telemetry history
    hist_res = await client.get("/api/v1/telemetry/history?device_id=ESP32-TEST-UNIT-1")
    assert hist_res.status_code == 200
    assert len(hist_res.json()["data"]) >= 1


@pytest.mark.asyncio
async def test_ai_unconfigured_response(client: AsyncClient):
    """Verify that unconfigured AI services return clean NOT_CONFIGURED error envelopes, NOT fake data."""
    response = await client.post("/api/v1/ai/detection", json={"storage_unit_id": "SU-001"})
    assert response.status_code == 501
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "NOT_CONFIGURED"
