import json
import os
import pytest

REGISTRY_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "registry"))


def test_registry_manifests_exist():
    assert os.path.isdir(REGISTRY_DIR), "Registry directory must exist"
    model_dirs = [d for d in os.listdir(REGISTRY_DIR) if os.path.isdir(os.path.join(REGISTRY_DIR, d))]
    assert len(model_dirs) >= 2, "Must contain at least produce-detector and spoilage-risk manifests"


def test_produce_detector_manifest_validity():
    manifest_path = os.path.join(REGISTRY_DIR, "produce-detector", "v1", "metadata.json")
    assert os.path.exists(manifest_path)
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data["model_name"] == "produce-detector"
    assert data["version"] == "v1.0.0"
    assert data["task_type"] == "DETECTION"
    assert "input_schema" in data
    assert "output_schema" in data
    assert data["status"] in ["PLANNED", "READY", "DEPRECATED"]


def test_spoilage_risk_manifest_validity():
    manifest_path = os.path.join(REGISTRY_DIR, "spoilage-risk", "v1", "metadata.json")
    assert os.path.exists(manifest_path)
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data["model_name"] == "spoilage-risk-estimator"
    assert data["task_type"] == "SPOILAGE_RISK"
    assert "input_schema" in data
    assert "output_schema" in data
