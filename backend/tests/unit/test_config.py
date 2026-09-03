from app.core.config import get_settings


def test_settings_load_defaults():
    settings = get_settings()
    assert settings.APP_NAME == "HIMARKA"
    assert settings.API_V1_PREFIX == "/api/v1"
    assert settings.API_PORT == 8000
    assert isinstance(settings.CORS_ORIGINS, list)
