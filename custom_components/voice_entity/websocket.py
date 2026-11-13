"""Websocket API for the Voice Entity Manager panel."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.homeassistant.exposed_entities import (
    async_expose_entity,
    async_should_expose,
)
from homeassistant.core import HomeAssistant, callback, split_entity_id
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .analysis import EntityInfo, analyze
from .const import ASSISTANT_ALEXA, ASSISTANT_CONVERSATION, ASSISTANT_GOOGLE

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_update)
    websocket_api.async_register_command(hass, ws_bulk_expose)


def _available_assistants(hass: HomeAssistant) -> list[str]:
    assistants = [ASSISTANT_CONVERSATION]
    if "cloud" in hass.config.components:
        assistants += [ASSISTANT_ALEXA, ASSISTANT_GOOGLE]
    return assistants


def _floor_names(hass: HomeAssistant) -> dict[str, str]:
    try:
        from homeassistant.helpers import floor_registry as fr  # noqa: PLC0415
    except ImportError:  # very old HA
        return {}
    return {f.floor_id: f.name for f in fr.async_get(hass).async_list_floors()}


def _should_expose(hass: HomeAssistant, assistant: str, entity_id: str) -> bool:
    try:
        return async_should_expose(hass, assistant, entity_id)
    except Exception:  # noqa: BLE001 - never break the whole list for one entity
        _LOGGER.debug("Could not read exposure for %s", entity_id, exc_info=True)
        return False


def _aliases_as_strings(aliases: Any) -> list[str]:
    return sorted(a for a in (aliases or ()) if isinstance(a, str))


@callback
def _collect(hass: HomeAssistant, assistant: str) -> list[EntityInfo]:
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)
    floors = _floor_names(hass)

    def area_info(area_id: str | None) -> tuple[str | None, str | None, str | None]:
        if not area_id or not (area := area_reg.async_get_area(area_id)):
            return None, None, None
        floor_id = getattr(area, "floor_id", None)
        return area.id, area.name, floors.get(floor_id) if floor_id else None

    result: list[EntityInfo] = []
    seen: set[str] = set()

    for entry in ent_reg.entities.values():
        entity_id = entry.entity_id
        seen.add(entity_id)
        state = hass.states.get(entity_id)
        device = dev_reg.async_get(entry.device_id) if entry.device_id else None

        device_name = None
        if device:
            device_name = device.name_by_user or device.name

        if state is not None:
            name = state.name
        elif entry.name:
            name = entry.name
        elif entry.has_entity_name and device_name:
            name = f"{device_name} {entry.original_name}" if entry.original_name else device_name
        else:
            name = entry.original_name or split_entity_id(entity_id)[1].replace("_", " ")

        area_id, area_name, floor_name = area_info(
            entry.area_id or (device.area_id if device else None)
        )

        result.append(
            EntityInfo(
                entity_id=entity_id,
                name=name,
                aliases=_aliases_as_strings(entry.aliases),
                domain=entry.domain,
                device_class=entry.device_class
                or entry.original_device_class
                or (state.attributes.get("device_class") if state else None),
                platform=entry.platform,
                device_id=entry.device_id,
                device_name=device_name,
                manufacturer=device.manufacturer if device else None,
                model=device.model if device else None,
                area_id=area_id,
                area_name=area_name,
                floor_name=floor_name,
                entity_category=entry.entity_category.value if entry.entity_category else None,
                hidden=entry.hidden_by is not None,
                disabled=entry.disabled_by is not None,
                in_registry=True,
                exposed=_should_expose(hass, assistant, entity_id),
            )
        )

    # Entities without unique_id (e.g. YAML-only) – no aliases possible.
    for state in hass.states.async_all():
        if state.entity_id in seen:
            continue
        result.append(
            EntityInfo(
                entity_id=state.entity_id,
                name=state.name,
                aliases=[],
                domain=state.domain,
                device_class=state.attributes.get("device_class"),
                platform=None,
                device_id=None,
                device_name=None,
                manufacturer=None,
                model=None,
                area_id=None,
                area_name=None,
                floor_name=None,
                entity_category=None,
                hidden=False,
                disabled=False,
                in_registry=False,
                exposed=_should_expose(hass, assistant, state.entity_id),
            )
        )
    return result


@callback
def _build_response(hass: HomeAssistant, assistant: str) -> dict[str, Any]:
    entities = _collect(hass, assistant)
    language = (hass.config.language or "en").split("-")[0]
    return {
        "assistant": assistant,
        "assistants": _available_assistants(hass),
        "language": language,
        "entities": analyze(entities, language),
    }


ASSISTANT_SCHEMA = vol.In([ASSISTANT_CONVERSATION, ASSISTANT_ALEXA, ASSISTANT_GOOGLE])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "voice_entity/list",
        vol.Optional("assistant", default=ASSISTANT_CONVERSATION): ASSISTANT_SCHEMA,
    }
)
@websocket_api.require_admin
@callback
def ws_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    connection.send_result(msg["id"], _build_response(hass, msg["assistant"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "voice_entity/update",
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("assistant", default=ASSISTANT_CONVERSATION): ASSISTANT_SCHEMA,
        vol.Optional("exposed"): bool,
        vol.Optional("aliases"): [str],
    }
)
@websocket_api.require_admin
@callback
def ws_update(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    entity_id: str = msg["entity_id"]

    if "aliases" in msg:
        ent_reg = er.async_get(hass)
        entry = ent_reg.async_get(entity_id)
        if entry is None:
            connection.send_error(
                msg["id"],
                "not_in_registry",
                "Diese Entität hat keine eindeutige ID – Aliase sind nicht möglich.",
            )
            return

        new_aliases: list[str] = []
        seen: set[str] = set()
        for alias in msg["aliases"]:
            alias = alias.strip()
            if alias and alias.casefold() not in seen:
                seen.add(alias.casefold())
                new_aliases.append(alias)

        # Keep any non-string placeholders HA may store (e.g. None in newer versions)
        # and keep the container type HA uses.
        extra = [a for a in (entry.aliases or ()) if not isinstance(a, str)]
        if isinstance(entry.aliases, list):
            value: Any = extra + new_aliases
        else:
            value = set(extra) | set(new_aliases)
        ent_reg.async_update_entity(entity_id, aliases=value)

    if "exposed" in msg:
        async_expose_entity(hass, msg["assistant"], entity_id, msg["exposed"])

    connection.send_result(msg["id"], _build_response(hass, msg["assistant"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "voice_entity/bulk_expose",
        vol.Required("entity_ids"): [cv.entity_id],
        vol.Required("exposed"): bool,
        vol.Optional("assistant", default=ASSISTANT_CONVERSATION): ASSISTANT_SCHEMA,
    }
)
@websocket_api.require_admin
@callback
def ws_bulk_expose(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    for entity_id in msg["entity_ids"]:
        async_expose_entity(hass, msg["assistant"], entity_id, msg["exposed"])
    connection.send_result(msg["id"], _build_response(hass, msg["assistant"]))
