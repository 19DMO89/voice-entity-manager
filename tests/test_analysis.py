"""Tests for the pure conflict/suggestion logic."""

import importlib.util
from pathlib import Path
import sys

_PATH = Path(__file__).parents[1] / "custom_components" / "voice_entity" / "analysis.py"
_spec = importlib.util.spec_from_file_location("voice_entity_analysis", _PATH)
analysis = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = analysis
_spec.loader.exec_module(analysis)


def make(entity_id, name, area=None, exposed=True, aliases=(), device=None, **kw):
    domain = entity_id.split(".")[0]
    return analysis.EntityInfo(
        entity_id=entity_id,
        name=name,
        aliases=list(aliases),
        domain=domain,
        device_class=kw.get("device_class"),
        platform="test",
        device_id=device,
        device_name=kw.get("device_name"),
        manufacturer=kw.get("manufacturer"),
        model=kw.get("model"),
        area_id=area.lower() if area else None,
        area_name=area,
        floor_name=None,
        entity_category=None,
        hidden=False,
        disabled=kw.get("disabled", False),
        in_registry=True,
        exposed=exposed,
    )


def by_id(result):
    return {e["entity_id"]: e for e in result}


def test_normalize():
    assert analysis.normalize("Küche-Licht ") == "kuche licht"
    assert analysis.normalize("Straße") == "strasse"
    assert analysis.normalize("DECKEN_lampe") == "decken lampe"


def test_same_area_conflict_is_error():
    res = by_id(analysis.analyze([
        make("light.a", "Deckenlampe", "Wohnzimmer"),
        make("light.b", "deckenlampe", "Wohnzimmer"),
    ], "de"))
    assert res["light.a"]["conflicts"][0]["severity"] == "error"


def test_other_area_conflict_is_warning_and_alias_counts():
    res = by_id(analysis.analyze([
        make("light.a", "Deckenlampe", "Wohnzimmer"),
        make("light.b", "Licht oben", "Küche", aliases=["Deckenlampe"]),
    ], "de"))
    c = res["light.a"]["conflicts"]
    assert len(c) == 1 and c[0]["severity"] == "warning" and c[0]["other_entity_id"] == "light.b"


def test_unexposed_entities_do_not_create_conflicts_for_others():
    res = by_id(analysis.analyze([
        make("light.a", "Lampe", "Flur"),
        make("light.b", "Lampe", "Flur", exposed=False),
        make("light.c", "Lampe", "Flur", exposed=True, disabled=True),
    ], "de"))
    assert res["light.a"]["conflicts"] == []
    # but the unexposed one sees the potential conflict
    assert res["light.b"]["conflicts"][0]["other_entity_id"] == "light.a"


def test_alias_equal_to_area_name_is_flagged():
    res = by_id(analysis.analyze([
        make("light.a", "Lampe", "Küche", aliases=["Küche"]),
    ], "de"))
    assert res["light.a"]["conflicts"][0]["kind"] == "area"


def test_suggestions_strip_area_and_vendor_and_avoid_conflicts():
    ents = [
        make("light.wz_decke", "Wohnzimmer Hue Deckenlampe 00178801abcd", "Wohnzimmer",
             manufacturer="Philips", model="Hue White"),
        make("light.kueche", "Wohnzimmer Licht", "Küche"),  # takes "Wohnzimmer Licht"
    ]
    res = by_id(analysis.analyze(ents, "de"))
    aliases = [s["alias"] for s in res["light.wz_decke"]["suggestions"]]
    assert "Deckenlampe" in aliases
    assert "Wohnzimmer Deckenlampe" in aliases
    # "Wohnzimmer Licht" is used in another area -> allowed, but only as "area" level
    lvl = {s["alias"]: s["level"] for s in res["light.wz_decke"]["suggestions"]}
    assert lvl.get("Wohnzimmer Licht", "area") == "area"
    assert all(len(aliases) <= analysis.MAX_SUGGESTIONS for _ in [0])


def test_suggestion_skipped_when_same_area_clash():
    ents = [
        make("light.a", "Deckenlampe", "Bad"),
        make("light.b", "Spiegel", "Bad", aliases=["Bad Licht"]),
    ]
    res = by_id(analysis.analyze(ents, "de"))
    assert "Bad Licht" not in [s["alias"] for s in res["light.a"]["suggestions"]]
    assert "Bad Deckenlampe" in [s["alias"] for s in res["light.a"]["suggestions"]]


def test_type_words():
    assert analysis.type_word("switch", "outlet", "de") == "Steckdose"
    assert analysis.type_word("binary_sensor", "window", "de") == "Fenster"
    assert analysis.type_word("light", None, "fr") == "Light"
    assert analysis.type_word("unknown_domain", None, "de") == "Unknown Domain"
