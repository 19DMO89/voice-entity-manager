"""Voice Entity Manager – overview of all entities and their voice assistant settings."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_COMPONENT, PANEL_URL_PATH, STATIC_URL, VERSION
from .websocket import async_register_websocket_commands

FRONTEND_DIR = Path(__file__).parent / "frontend"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the panel and websocket API."""
    data = hass.data.setdefault(DOMAIN, {})

    # Static paths and websocket commands cannot be unregistered,
    # so register them only once per HA run.
    if not data.get("registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=False)]
        )
        async_register_websocket_commands(hass)
        data["registered"] = True

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_COMPONENT,
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL}/voice-entity-panel.js?v={VERSION}",
        sidebar_title="Sprachentitäten",
        sidebar_icon="mdi:account-voice",
        require_admin=True,
        config={},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True
