"""Conflict detection and alias suggestions.

Pure Python (no Home Assistant imports) so it can be tested standalone.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import asdict, dataclass, field
import re
import unicodedata
from typing import Any

MAX_SUGGESTIONS = 4

# Domains that are usually useful for voice control (used as default filter in the UI).
VOICE_DOMAINS = {
    "alarm_control_panel", "button", "climate", "cover", "fan", "humidifier",
    "input_boolean", "input_button", "lawn_mower", "light", "lock", "media_player",
    "scene", "script", "sensor", "binary_sensor", "switch", "vacuum", "valve",
    "water_heater", "todo", "weather", "timer", "siren",
}

TYPE_WORDS: dict[str, dict[str, str]] = {
    "de": {
        "light": "Licht", "switch": "Schalter", "switch.outlet": "Steckdose",
        "fan": "Ventilator", "cover": "Rollladen", "cover.blind": "Jalousie",
        "cover.shade": "Rollo", "cover.curtain": "Vorhang", "cover.awning": "Markise",
        "cover.garage": "Garagentor", "cover.gate": "Tor", "cover.door": "Tür",
        "cover.window": "Fenster", "climate": "Heizung", "lock": "Schloss",
        "media_player": "Mediaplayer", "media_player.tv": "Fernseher",
        "media_player.speaker": "Lautsprecher", "media_player.receiver": "Receiver",
        "vacuum": "Staubsauger", "lawn_mower": "Rasenmäher", "valve": "Ventil",
        "water_heater": "Warmwasser", "humidifier": "Luftbefeuchter",
        "alarm_control_panel": "Alarmanlage", "siren": "Sirene", "camera": "Kamera",
        "scene": "Szene", "script": "Skript", "automation": "Automation",
        "input_boolean": "Schalter", "input_button": "Taster", "button": "Taster",
        "input_number": "Zahl", "input_select": "Auswahl", "input_text": "Text",
        "number": "Zahl", "select": "Auswahl", "todo": "Liste", "weather": "Wetter",
        "timer": "Timer", "person": "Person", "device_tracker": "Tracker",
        "sensor": "Sensor", "sensor.temperature": "Temperatur",
        "sensor.humidity": "Luftfeuchtigkeit", "sensor.power": "Leistung",
        "sensor.energy": "Energie", "sensor.illuminance": "Helligkeit",
        "sensor.battery": "Batterie", "sensor.carbon_dioxide": "CO2",
        "sensor.pm25": "Feinstaub", "sensor.pressure": "Luftdruck",
        "binary_sensor": "Binärsensor", "binary_sensor.door": "Tür",
        "binary_sensor.window": "Fenster", "binary_sensor.motion": "Bewegungsmelder",
        "binary_sensor.occupancy": "Anwesenheit", "binary_sensor.presence": "Anwesenheit",
        "binary_sensor.smoke": "Rauchmelder", "binary_sensor.moisture": "Wassermelder",
        "binary_sensor.opening": "Kontakt", "binary_sensor.garage_door": "Garagentor",
        "binary_sensor.lock": "Schloss", "binary_sensor.battery": "Batterie",
        "update": "Update", "event": "Ereignis", "image": "Bild", "calendar": "Kalender",
        "zone": "Zone", "sun": "Sonne",
    },
    "en": {
        "light": "Light", "switch": "Switch", "switch.outlet": "Outlet", "fan": "Fan",
        "cover": "Cover", "cover.blind": "Blinds", "cover.shade": "Shade",
        "cover.curtain": "Curtain", "cover.awning": "Awning", "cover.garage": "Garage Door",
        "cover.gate": "Gate", "cover.door": "Door", "cover.window": "Window",
        "climate": "Heating", "lock": "Lock", "media_player": "Media Player",
        "media_player.tv": "TV", "media_player.speaker": "Speaker",
        "media_player.receiver": "Receiver", "vacuum": "Vacuum", "lawn_mower": "Mower",
        "valve": "Valve", "water_heater": "Water Heater", "humidifier": "Humidifier",
        "alarm_control_panel": "Alarm", "siren": "Siren", "camera": "Camera",
        "scene": "Scene", "script": "Script", "automation": "Automation",
        "input_boolean": "Switch", "input_button": "Button", "button": "Button",
        "input_number": "Number", "input_select": "Select", "input_text": "Text",
        "number": "Number", "select": "Select", "todo": "List", "weather": "Weather",
        "timer": "Timer", "person": "Person", "device_tracker": "Tracker",
        "sensor": "Sensor", "sensor.temperature": "Temperature",
        "sensor.humidity": "Humidity", "sensor.power": "Power", "sensor.energy": "Energy",
        "sensor.illuminance": "Brightness", "sensor.battery": "Battery",
        "sensor.carbon_dioxide": "CO2", "sensor.pm25": "Particulates",
        "sensor.pressure": "Pressure", "binary_sensor": "Binary Sensor",
        "binary_sensor.door": "Door", "binary_sensor.window": "Window",
        "binary_sensor.motion": "Motion", "binary_sensor.occupancy": "Occupancy",
        "binary_sensor.presence": "Presence", "binary_sensor.smoke": "Smoke Detector",
        "binary_sensor.moisture": "Leak Sensor", "binary_sensor.opening": "Contact",
        "binary_sensor.garage_door": "Garage Door", "binary_sensor.lock": "Lock",
        "binary_sensor.battery": "Battery", "update": "Update", "event": "Event",
        "image": "Image", "calendar": "Calendar", "zone": "Zone", "sun": "Sun",
    },
}

_HEXISH = re.compile(r"(0x)?[0-9a-f]{6,}")


@dataclass
class EntityInfo:
    """Everything the analysis needs to know about one entity."""

    entity_id: str
    name: str
    aliases: list[str]
    domain: str
    device_class: str | None
    platform: str | None
    device_id: str | None
    device_name: str | None
    manufacturer: str | None
    model: str | None
    area_id: str | None
    area_name: str | None
    floor_name: str | None
    entity_category: str | None
    hidden: bool
    disabled: bool
    in_registry: bool
    exposed: bool
    extra: dict[str, Any] = field(default_factory=dict)


def normalize(text: str) -> str:
    """Normalise a spoken name for comparison (case, accents, punctuation)."""
    text = unicodedata.normalize("NFKD", text.casefold().replace("ß", "ss"))
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[\W_]+", " ", text)
    return " ".join(text.split())


def type_word(domain: str, device_class: str | None, language: str) -> str:
    words = TYPE_WORDS.get(language, TYPE_WORDS["en"])
    if device_class and f"{domain}.{device_class}" in words:
        return words[f"{domain}.{device_class}"]
    return words.get(domain, domain.replace("_", " ").title())


def _strip_phrase(text: str, phrase: str | None) -> str:
    if not phrase:
        return text
    return re.sub(rf"(?i)(?<!\w){re.escape(phrase)}(?!\w)", " ", text)


def clean_name(text: str, entity: EntityInfo) -> str:
    """Remove area, manufacturer/model and technical ids from a name."""
    text = _strip_phrase(text, entity.area_name)
    noise = {
        normalize(tok)
        for src in (entity.manufacturer, entity.model)
        if src
        for tok in src.split()
        if len(tok) > 1
    }
    tokens = [
        tok
        for tok in re.split(r"[\s_]+", text)
        if tok
        and normalize(tok)
        and normalize(tok) not in noise
        and not _HEXISH.fullmatch(tok.lower())
    ]
    result = " ".join(tokens).strip(" -–:,.()")
    return " ".join(result.split())


def _pretty_object_id(entity_id: str) -> str:
    object_id = entity_id.split(".", 1)[1]
    return " ".join(w.capitalize() for w in object_id.split("_") if w)


def analyze(entities: list[EntityInfo], language: str) -> list[dict[str, Any]]:
    """Return serialisable entity dicts with conflicts and alias suggestions."""
    by_id = {e.entity_id: e for e in entities}

    # Index of every spoken name of every exposed, enabled entity.
    index: dict[str, list[tuple[str, str]]] = {}
    for ent in entities:
        if not ent.exposed or ent.disabled:
            continue
        for label in [ent.name, *ent.aliases]:
            if n := normalize(label):
                index.setdefault(n, []).append((ent.entity_id, label))

    area_norms = {normalize(e.area_name) for e in entities if e.area_name}
    area_norms |= {normalize(e.floor_name) for e in entities if e.floor_name}
    area_norms.discard("")

    entities_per_device = Counter(
        e.device_id for e in entities if e.device_id and e.entity_category is None
    )

    out: list[dict[str, Any]] = []
    for ent in entities:
        data = asdict(ent)
        data.pop("extra")
        data.update(ent.extra)
        data["type_label"] = type_word(ent.domain, ent.device_class, language)
        data["domain_label"] = type_word(ent.domain, None, language)
        data["voice_domain"] = ent.domain in VOICE_DOMAINS
        data["conflicts"] = _conflicts(ent, by_id, index, area_norms)
        data["suggestions"] = (
            _suggestions(ent, by_id, index, area_norms, entities_per_device, language)
            if ent.in_registry
            else []
        )
        out.append(data)
    return out


def _conflicts(
    ent: EntityInfo,
    by_id: dict[str, EntityInfo],
    index: dict[str, list[tuple[str, str]]],
    area_norms: set[str],
) -> list[dict[str, Any]]:
    found: dict[str, dict[str, Any]] = {}
    for label in [ent.name, *ent.aliases]:
        n = normalize(label)
        if not n:
            continue
        for other_id, other_label in index.get(n, []):
            if other_id == ent.entity_id:
                continue
            other = by_id[other_id]
            same_area = other.area_id == ent.area_id
            severity = "error" if same_area else "warning"
            prev = found.get(other_id)
            if prev and prev["severity"] == "error":
                continue
            found[other_id] = {
                "kind": "entity",
                "label": label,
                "other_entity_id": other_id,
                "other_name": other.name,
                "other_label": other_label,
                "other_area": other.area_name,
                "severity": severity,
            }
        if n in area_norms and label in ent.aliases:
            found[f"area:{n}"] = {
                "kind": "area",
                "label": label,
                "severity": "warning",
            }
    return sorted(found.values(), key=lambda c: c["severity"] != "error")


def _suggestions(
    ent: EntityInfo,
    by_id: dict[str, EntityInfo],
    index: dict[str, list[tuple[str, str]]],
    area_norms: set[str],
    entities_per_device: Counter,
    language: str,
) -> list[dict[str, str]]:
    own = {normalize(x) for x in [ent.name, *ent.aliases]}
    word = type_word(ent.domain, ent.device_class, language)
    area = ent.area_name

    base = clean_name(ent.name, ent)
    candidates: list[str] = []
    if base:
        candidates.append(base)
        if area:
            candidates.append(f"{area} {base}")
    if area and word and ent.entity_category is None:
        candidates.append(f"{area} {word}")
    if ent.device_name and entities_per_device.get(ent.device_id, 0) == 1:
        dev = clean_name(ent.device_name, ent)
        if dev:
            candidates.append(dev)
            if area:
                candidates.append(f"{area} {dev}")
    pretty = clean_name(_pretty_object_id(ent.entity_id), ent)
    if pretty:
        candidates.append(pretty)

    result: list[dict[str, str]] = []
    seen: set[str] = set()
    for cand in candidates:
        n = normalize(cand)
        if len(n) < 3 or n in own or n in seen or n in area_norms:
            continue
        seen.add(n)
        clashes = [by_id[o] for o, _ in index.get(n, []) if o != ent.entity_id]
        if any(o.area_id == ent.area_id for o in clashes):
            continue  # would be ambiguous even with the area spoken
        # "ok": unique everywhere; "area": unique only when the area is spoken too
        level = "ok" if not clashes else "area"
        result.append({"alias": cand, "level": level})

    result.sort(key=lambda s: s["level"] != "ok")
    return result[:MAX_SUGGESTIONS]
