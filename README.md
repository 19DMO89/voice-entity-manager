# Voice Entity Manager

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/DominikSchremser)

Eine Home-Assistant-Integration (installierbar über HACS), die ein eigenes Seitenleisten-Panel **„Sprachentitäten“** hinzufügt. Dort siehst du alle Entitäten mit ihren Sprachassistent-Einstellungen auf einen Blick und kannst sie bearbeiten.

## Funktionen

- **Alle Entitäten in einer Tabelle** mit Name, Entity-ID, **Gerät** (inkl. Hersteller/Modell), **Bereich/Etage** und **Typ** (Licht, Schalter, Steckdose, Rollladen, Temperatur …, abgeleitet aus Domain + Device-Class)
- **Freigabe für den Sprachassistenten** per Schalter, für Assist und, falls Home Assistant Cloud eingerichtet ist, auch für Alexa und Google Assistant
- **Aliase bearbeiten**: hinzufügen (Enter) und entfernen (✕)
- **Alias-Vorschläge**, die gegen alle freigegebenen Entitäten geprüft werden:
  - 🟢 grün: eindeutig im ganzen Haus
  - 🟠 orange: nur eindeutig, wenn der Bereich mitgesprochen wird („… im Wohnzimmer“)
  - Vorschläge, die im selben Bereich kollidieren oder einem Bereichs-/Etagennamen entsprechen, werden gar nicht erst angeboten
- **Konflikterkennung** (Groß-/Kleinschreibung, Umlaute und Satzzeichen werden ignoriert):
  - ⛔ gleicher Name/Alias im **selben Bereich**: Assist kann nicht unterscheiden
  - ⚠ gleicher Name in einem **anderen Bereich**: funktioniert nur, wenn der Bereich mitgesprochen wird
  - ⚠ Alias entspricht einem Bereichsnamen
- **Filter**: Freitextsuche, Typ, Bereich (auch „ohne Bereich“), Etage, Integration, freigegeben ja/nein, mit/ohne Alias, mit/ohne Konflikt, nur sprachrelevante Typen, versteckte/deaktivierte und Diagnose-Entitäten ein-/ausblenden. Die Filter bleiben im Browser gespeichert.
- **Sortierung** per Klick auf den Spaltenkopf
- **Mehrfachauswahl**: mehrere Entitäten auf einmal freigeben oder die Freigabe entziehen
- **Piktogramm** pro Typ (bzw. das eigene Icon der Entität)
- **PDF-Export** aller freigegebenen Entitäten, gegliedert nach Bereich → Gerät → Entität mit Aliasen (über den Druckdialog „Als PDF speichern“)
- Klick auf den Namen öffnet den normalen Home-Assistant-Dialog der Entität
- Oberfläche auf Deutsch und Englisch (je nach HA-Sprache), auf dem Handy als Karten-Layout

Das Panel ist nur für Administratoren sichtbar.

## Installation

### HACS (benutzerdefiniertes Repository)

1. HACS → ⋮ → **Benutzerdefinierte Repositories** → `https://github.com/19DMO89/voice-entity-manager`, Kategorie **Integration**
2. „Voice Entity Manager“ installieren und Home Assistant neu starten
3. **Einstellungen → Geräte & Dienste → Integration hinzufügen → Voice Entity Manager**
4. In der Seitenleiste erscheint **Sprachentitäten**

### Manuell

Den Ordner `custom_components/voice_entity` nach `<config>/custom_components/` kopieren, neu starten und dann ab Schritt 3 weitermachen.

## Hinweise

- Aliase gibt es nur für Entitäten mit eindeutiger ID (Entity Registry). Reine YAML-Entitäten ohne `unique_id` werden angezeigt, können aber nur freigegeben werden.
- Für die Konfliktprüfung zählen nur Entitäten, die für den gewählten Assistenten **freigegeben** und nicht deaktiviert sind. Bei nicht freigegebenen Entitäten werden mögliche Konflikte abgeschwächt angezeigt, also „würde kollidieren, wenn freigegeben“.
- Geändert werden ausschließlich die normalen Home-Assistant-Einstellungen (Freigabe und Aliase), dieselben wie unter *Einstellungen → Sprachassistenten → Freigaben*. Die Integration speichert nichts Eigenes.

## Entwicklung

```bash
pip install pytest
pytest tests
```

Die Vorschlags- und Konfliktlogik in `analysis.py` kommt ohne Home Assistant aus und lässt sich deshalb direkt testen.

## Lizenz

MIT, siehe [LICENSE](LICENSE).

## Unterstützen

Wenn dir die Integration gefällt, freue ich mich über einen Kaffee ☕

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/DominikSchremser)
