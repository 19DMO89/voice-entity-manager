/* Voice Entity Manager – sidebar panel (vanilla web component, no build step). */

const STRINGS = {
  de: {
    title: "Sprachentitäten",
    search: "Suchen (Name, Entität, Gerät, Alias …)",
    assistant: "Assistent",
    conversation: "Assist",
    "cloud.alexa": "Alexa",
    "cloud.google_assistant": "Google Assistant",
    allTypes: "Alle Typen",
    allAreas: "Alle Bereiche",
    noArea: "Ohne Bereich",
    allFloors: "Alle Etagen",
    allIntegrations: "Alle Integrationen",
    exposure: "Freigabe",
    all: "Alle",
    exposedOnly: "Nur freigegeben",
    notExposed: "Nicht freigegeben",
    aliasFilter: "Aliase",
    withAlias: "Mit Alias",
    withoutAlias: "Ohne Alias",
    conflictFilter: "Konflikte",
    anyConflict: "Mit Konflikt",
    errorConflict: "Nur echte Konflikte",
    noConflict: "Ohne Konflikt",
    voiceOnly: "Nur sprachrelevante Typen",
    showHidden: "Versteckte/Deaktivierte zeigen",
    showConfig: "Diagnose-/Konfig-Entitäten zeigen",
    entity: "Entität",
    type: "Typ",
    device: "Gerät",
    area: "Bereich",
    exposed: "Freigegeben",
    aliases: "Aliase",
    suggestions: "Vorschläge",
    status: "Status",
    addAlias: "Alias hinzufügen …",
    noSuggestions: "–",
    hidden: "versteckt",
    disabled: "deaktiviert",
    noRegistry: "keine ID – keine Aliase möglich",
    selected: "ausgewählt",
    selectVisible: "Alle gefilterten auswählen",
    clearSelection: "Auswahl aufheben",
    exposeSelected: "Freigeben",
    unexposeSelected: "Freigabe entziehen",
    showMore: "Weitere anzeigen",
    reload: "Neu laden",
    total: "Entitäten",
    shown: "angezeigt",
    exposedCount: "freigegeben",
    conflictCount: "mit Konflikt",
    conflictError: "Gleicher Name im selben Bereich wie",
    conflictWarning: "Gleicher Name wie (anderer Bereich – Bereich mitsprechen)",
    conflictArea: "Alias entspricht einem Bereichs-/Etagennamen",
    ok: "OK",
    suggestionOk: "Eindeutig",
    suggestionArea: "Nur mit Bereich eindeutig",
    error: "Fehler",
    loading: "Lade Entitäten …",
    resetFilters: "Filter zurücksetzen",
    confirmBulk: "Freigabe für {n} Entitäten ändern?",
    exportPdf: "PDF-Export",
    exportTitle: "Freigegebene Sprachentitäten",
    exportFile: "Sprachentitaeten",
    noDevice: "Ohne Gerät",
    generated: "Erstellt am",
    areasCount: "Bereiche",
    devicesCount: "Geräte",
    noAliases: "–",
    nothingExposed: "Es sind keine Entitäten freigegeben.",
  },
  en: {
    title: "Voice entities",
    search: "Search (name, entity, device, alias …)",
    assistant: "Assistant",
    conversation: "Assist",
    "cloud.alexa": "Alexa",
    "cloud.google_assistant": "Google Assistant",
    allTypes: "All types",
    allAreas: "All areas",
    noArea: "No area",
    allFloors: "All floors",
    allIntegrations: "All integrations",
    exposure: "Exposure",
    all: "All",
    exposedOnly: "Exposed only",
    notExposed: "Not exposed",
    aliasFilter: "Aliases",
    withAlias: "With alias",
    withoutAlias: "Without alias",
    conflictFilter: "Conflicts",
    anyConflict: "With conflict",
    errorConflict: "Real conflicts only",
    noConflict: "No conflict",
    voiceOnly: "Voice-relevant types only",
    showHidden: "Show hidden/disabled",
    showConfig: "Show diagnostic/config entities",
    entity: "Entity",
    type: "Type",
    device: "Device",
    area: "Area",
    exposed: "Exposed",
    aliases: "Aliases",
    suggestions: "Suggestions",
    status: "Status",
    addAlias: "Add alias …",
    noSuggestions: "–",
    hidden: "hidden",
    disabled: "disabled",
    noRegistry: "no unique ID – aliases not possible",
    selected: "selected",
    selectVisible: "Select all filtered",
    clearSelection: "Clear selection",
    exposeSelected: "Expose",
    unexposeSelected: "Unexpose",
    showMore: "Show more",
    reload: "Reload",
    total: "entities",
    shown: "shown",
    exposedCount: "exposed",
    conflictCount: "with conflict",
    conflictError: "Same name in the same area as",
    conflictWarning: "Same name as (other area – say the area too)",
    conflictArea: "Alias equals an area/floor name",
    ok: "OK",
    suggestionOk: "Unique",
    suggestionArea: "Unique only together with area",
    error: "Error",
    loading: "Loading entities …",
    resetFilters: "Reset filters",
    confirmBulk: "Change exposure for {n} entities?",
    exportPdf: "PDF export",
    exportTitle: "Exposed voice entities",
    exportFile: "Voice-entities",
    noDevice: "No device",
    generated: "Generated on",
    areasCount: "areas",
    devicesCount: "devices",
    noAliases: "–",
    nothingExposed: "No entities are exposed.",
  },
};

const DOMAIN_ICONS = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch-variant",
  "switch.outlet": "mdi:power-socket-de",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  "cover.blind": "mdi:blinds-horizontal",
  "cover.curtain": "mdi:curtains",
  "cover.garage": "mdi:garage",
  "cover.gate": "mdi:gate",
  "cover.door": "mdi:door",
  "cover.awning": "mdi:awning-outline",
  climate: "mdi:thermostat",
  lock: "mdi:lock",
  media_player: "mdi:cast",
  "media_player.tv": "mdi:television",
  "media_player.speaker": "mdi:speaker",
  "media_player.receiver": "mdi:audio-video",
  vacuum: "mdi:robot-vacuum",
  lawn_mower: "mdi:robot-mower",
  valve: "mdi:valve",
  water_heater: "mdi:water-boiler",
  humidifier: "mdi:air-humidifier",
  alarm_control_panel: "mdi:shield-home",
  siren: "mdi:bullhorn",
  camera: "mdi:cctv",
  scene: "mdi:palette",
  script: "mdi:script-text",
  automation: "mdi:robot",
  input_boolean: "mdi:toggle-switch-outline",
  input_button: "mdi:gesture-tap-button",
  button: "mdi:gesture-tap-button",
  input_number: "mdi:ray-vertex",
  number: "mdi:ray-vertex",
  input_select: "mdi:format-list-bulleted",
  select: "mdi:format-list-bulleted",
  input_text: "mdi:form-textbox",
  todo: "mdi:clipboard-list",
  weather: "mdi:weather-partly-cloudy",
  timer: "mdi:timer-outline",
  person: "mdi:account",
  device_tracker: "mdi:map-marker",
  calendar: "mdi:calendar",
  update: "mdi:package-up",
  event: "mdi:gesture-double-tap",
  image: "mdi:image",
  zone: "mdi:map-marker-radius",
  sun: "mdi:white-balance-sunny",
  sensor: "mdi:eye",
  "sensor.temperature": "mdi:thermometer",
  "sensor.humidity": "mdi:water-percent",
  "sensor.power": "mdi:flash",
  "sensor.energy": "mdi:lightning-bolt",
  "sensor.illuminance": "mdi:brightness-5",
  "sensor.battery": "mdi:battery",
  "sensor.carbon_dioxide": "mdi:molecule-co2",
  "sensor.pressure": "mdi:gauge",
  binary_sensor: "mdi:radiobox-marked",
  "binary_sensor.door": "mdi:door",
  "binary_sensor.window": "mdi:window-closed",
  "binary_sensor.motion": "mdi:motion-sensor",
  "binary_sensor.occupancy": "mdi:home-account",
  "binary_sensor.presence": "mdi:home-account",
  "binary_sensor.smoke": "mdi:smoke-detector",
  "binary_sensor.moisture": "mdi:water-alert",
  "binary_sensor.opening": "mdi:square-outline",
  "binary_sensor.battery": "mdi:battery-alert",
};

const iconFor = (e) =>
  e.icon || DOMAIN_ICONS[`${e.domain}.${e.device_class}`] || DOMAIN_ICONS[e.domain] || "mdi:help-circle-outline";

const PAGE_SIZE = 100;
const STORAGE_KEY = "voice_entity_filters";

const DEFAULT_FILTERS = {
  search: "",
  domain: "",
  area: "",
  floor: "",
  platform: "",
  exposed: "all",
  alias: "all",
  conflict: "all",
  voiceOnly: true,
  showHidden: false,
  showConfig: false,
};

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

class VoiceEntityPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this._assistant = "conversation";
    this._filters = { ...DEFAULT_FILTERS };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) this._filters = { ...DEFAULT_FILTERS, ...saved, search: "" };
    } catch (e) {
      /* ignore */
    }
    this._selected = new Set();
    this._limit = PAGE_SIZE;
    this._sort = { key: "name", dir: 1 };
    this._busy = false;
    this._error = null;
    this._initialised = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._menuButton) this._menuButton.hass = hass;
    if (!this._initialised) {
      this._initialised = true;
      this._t = STRINGS[(hass.language || "en").startsWith("de") ? "de" : "en"];
      this._renderShell();
      this._load();
    }
  }

  set narrow(value) {
    this._narrow = value;
    if (this._menuButton) this._menuButton.narrow = value;
  }

  set panel(_) {}
  set route(_) {}

  // ---------------------------------------------------------------- data ---

  async _call(msg) {
    this._busy = true;
    this._updateBusy();
    try {
      const res = await this._hass.callWS({ assistant: this._assistant, ...msg });
      this._data = res;
      this._error = null;
    } catch (err) {
      this._error = err?.message || String(err);
    } finally {
      this._busy = false;
      this._updateBusy();
    }
    this._renderFilterOptions();
    this._renderTable();
  }

  _load() {
    return this._call({ type: "voice_entity/list" });
  }

  _update(entityId, changes) {
    return this._call({ type: "voice_entity/update", entity_id: entityId, ...changes });
  }

  _entity(entityId) {
    return this._data?.entities.find((e) => e.entity_id === entityId);
  }

  _saveFilters() {
    try {
      const { search, ...rest } = this._filters;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch (e) {
      /* ignore */
    }
  }

  _filtered() {
    if (!this._data) return [];
    const f = this._filters;
    const q = f.search.trim().toLowerCase();
    const list = this._data.entities.filter((e) => {
      if (!f.showHidden && (e.hidden || e.disabled)) return false;
      if (!f.showConfig && e.entity_category) return false;
      if (f.voiceOnly && !e.voice_domain) return false;
      if (f.domain && e.domain !== f.domain) return false;
      if (f.area === "__none__" ? e.area_id : f.area && e.area_id !== f.area) return false;
      if (f.floor && e.floor_name !== f.floor) return false;
      if (f.platform && e.platform !== f.platform) return false;
      if (f.exposed === "yes" && !e.exposed) return false;
      if (f.exposed === "no" && e.exposed) return false;
      if (f.alias === "with" && !e.aliases.length) return false;
      if (f.alias === "without" && e.aliases.length) return false;
      const relevantConflicts = e.exposed ? e.conflicts : [];
      if (f.conflict === "any" && !relevantConflicts.length) return false;
      if (f.conflict === "error" && !relevantConflicts.some((c) => c.severity === "error")) return false;
      if (f.conflict === "none" && relevantConflicts.length) return false;
      if (q) {
        const hay = [e.name, e.entity_id, e.device_name, e.area_name, e.floor_name, e.type_label, e.platform, e.manufacturer, e.model, ...e.aliases]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!q.split(/\s+/).every((part) => hay.includes(part))) return false;
      }
      return true;
    });
    const { key, dir } = this._sort;
    const val = (e) => {
      if (key === "exposed") return e.exposed ? 0 : 1;
      if (key === "status") return -(e.exposed ? e.conflicts.length : 0);
      return (e[key] ?? "￿").toString().toLowerCase();
    };
    list.sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      return (va < vb ? -1 : va > vb ? 1 : 0) * dir || a.name.localeCompare(b.name);
    });
    return list;
  }

  // -------------------------------------------------------------- render ---

  _renderShell() {
    const t = this._t;
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="toolbar-top">
        <span id="menu"></span>
        <h1>${esc(t.title)}</h1>
        <div class="spacer"></div>
        <label class="assistant">${esc(t.assistant)}
          <select id="assistant"></select>
        </label>
        <button id="export" class="export-btn" title="${esc(t.exportPdf)}">⇩ ${esc(t.exportPdf)}</button>
        <button id="reload" class="icon-btn" title="${esc(t.reload)}">⟳</button>
      </div>
      <div class="content">
        <div class="filters">
          <input id="search" type="search" placeholder="${esc(t.search)}" />
          <select data-filter="domain"></select>
          <select data-filter="area"></select>
          <select data-filter="floor"></select>
          <select data-filter="platform"></select>
          <select data-filter="exposed">
            <option value="all">${esc(t.exposure)}: ${esc(t.all)}</option>
            <option value="yes">${esc(t.exposedOnly)}</option>
            <option value="no">${esc(t.notExposed)}</option>
          </select>
          <select data-filter="alias">
            <option value="all">${esc(t.aliasFilter)}: ${esc(t.all)}</option>
            <option value="with">${esc(t.withAlias)}</option>
            <option value="without">${esc(t.withoutAlias)}</option>
          </select>
          <select data-filter="conflict">
            <option value="all">${esc(t.conflictFilter)}: ${esc(t.all)}</option>
            <option value="any">${esc(t.anyConflict)}</option>
            <option value="error">${esc(t.errorConflict)}</option>
            <option value="none">${esc(t.noConflict)}</option>
          </select>
          <label class="check"><input type="checkbox" data-filter="voiceOnly" /> ${esc(t.voiceOnly)}</label>
          <label class="check"><input type="checkbox" data-filter="showHidden" /> ${esc(t.showHidden)}</label>
          <label class="check"><input type="checkbox" data-filter="showConfig" /> ${esc(t.showConfig)}</label>
          <button id="reset" class="link">${esc(t.resetFilters)}</button>
        </div>
        <div class="summary" id="summary"></div>
        <div class="bulk" id="bulk" hidden>
          <span id="bulk-count"></span>
          <button data-bulk="expose">${esc(t.exposeSelected)}</button>
          <button data-bulk="unexpose">${esc(t.unexposeSelected)}</button>
          <button data-bulk="clear" class="link">${esc(t.clearSelection)}</button>
        </div>
        <div id="error" class="error" hidden></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="sel"><input type="checkbox" id="select-all" title="${esc(t.selectVisible)}" /></th>
                <th data-sort="name">${esc(t.entity)}</th>
                <th data-sort="type_label">${esc(t.type)}</th>
                <th data-sort="device_name">${esc(t.device)}</th>
                <th data-sort="area_name">${esc(t.area)}</th>
                <th data-sort="exposed">${esc(t.exposed)}</th>
                <th>${esc(t.aliases)}</th>
                <th>${esc(t.suggestions)}</th>
                <th data-sort="status">${esc(t.status)}</th>
              </tr>
            </thead>
            <tbody id="rows"><tr><td colspan="9" class="empty">${esc(t.loading)}</td></tr></tbody>
          </table>
        </div>
        <div class="more"><button id="more" hidden>${esc(t.showMore)}</button></div>
      </div>
    `;

    const root = this.shadowRoot;

    if (customElements.get("ha-menu-button")) {
      this._menuButton = document.createElement("ha-menu-button");
      this._menuButton.hass = this._hass;
      this._menuButton.narrow = this._narrow;
      root.getElementById("menu").appendChild(this._menuButton);
    }

    root.getElementById("reload").addEventListener("click", () => this._load());
    root.getElementById("export").addEventListener("click", () => this._exportPdf());
    root.getElementById("assistant").addEventListener("change", (ev) => {
      this._assistant = ev.target.value;
      this._selected.clear();
      this._load();
    });

    let searchTimer;
    root.getElementById("search").addEventListener("input", (ev) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this._filters.search = ev.target.value;
        this._limit = PAGE_SIZE;
        this._renderTable();
      }, 150);
    });

    root.querySelectorAll("[data-filter]").forEach((el) => {
      el.addEventListener("change", () => {
        const key = el.dataset.filter;
        this._filters[key] = el.type === "checkbox" ? el.checked : el.value;
        this._limit = PAGE_SIZE;
        this._saveFilters();
        this._renderTable();
      });
    });

    root.getElementById("reset").addEventListener("click", () => {
      this._filters = { ...DEFAULT_FILTERS };
      root.getElementById("search").value = "";
      this._saveFilters();
      this._renderFilterOptions();
      this._renderTable();
    });

    root.querySelectorAll("th[data-sort]").forEach((th) =>
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        this._sort = { key, dir: this._sort.key === key ? -this._sort.dir : 1 };
        this._renderTable();
      })
    );

    root.getElementById("select-all").addEventListener("change", (ev) => {
      const visible = this._filtered();
      if (ev.target.checked) visible.forEach((e) => this._selected.add(e.entity_id));
      else visible.forEach((e) => this._selected.delete(e.entity_id));
      this._renderTable();
    });

    root.getElementById("more").addEventListener("click", () => {
      this._limit += PAGE_SIZE;
      this._renderTable();
    });

    root.getElementById("bulk").addEventListener("click", (ev) => {
      const action = ev.target.dataset?.bulk;
      if (!action) return;
      if (action === "clear") {
        this._selected.clear();
        this._renderTable();
        return;
      }
      const ids = [...this._selected];
      if (ids.length > 20 && !confirm(this._t.confirmBulk.replace("{n}", ids.length))) return;
      this._call({ type: "voice_entity/bulk_expose", entity_ids: ids, exposed: action === "expose" });
    });

    const rows = root.getElementById("rows");
    rows.addEventListener("click", (ev) => this._onRowClick(ev));
    rows.addEventListener("change", (ev) => this._onRowChange(ev));
    rows.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && ev.target.classList.contains("alias-input")) {
        ev.preventDefault();
        this._addAlias(ev.target.dataset.id, ev.target.value);
      }
    });
  }

  _renderFilterOptions() {
    if (!this._data) return;
    const t = this._t;
    const root = this.shadowRoot;
    const ents = this._data.entities;
    const f = this._filters;

    const assistantSel = root.getElementById("assistant");
    assistantSel.innerHTML = this._data.assistants
      .map((a) => `<option value="${esc(a)}" ${a === this._assistant ? "selected" : ""}>${esc(t[a] || a)}</option>`)
      .join("");

    const uniq = (pairs) => [...new Map(pairs.filter(([k]) => k)).entries()].sort((a, b) => a[1].localeCompare(b[1]));
    const opts = (items, current, allLabel, extra = "") =>
      `<option value="">${esc(allLabel)}</option>${extra}` +
      items.map(([v, l]) => `<option value="${esc(v)}" ${v === current ? "selected" : ""}>${esc(l)}</option>`).join("");

    const sel = (key) => root.querySelector(`select[data-filter="${key}"]`);
    sel("domain").innerHTML = opts(
      uniq(ents.map((e) => [e.domain, `${e.domain_label} (${e.domain})`])),
      f.domain,
      t.allTypes
    );
    sel("area").innerHTML = opts(
      uniq(ents.map((e) => [e.area_id, e.area_name])),
      f.area,
      t.allAreas,
      `<option value="__none__" ${f.area === "__none__" ? "selected" : ""}>${esc(t.noArea)}</option>`
    );
    const floors = uniq(ents.map((e) => [e.floor_name, e.floor_name]));
    sel("floor").innerHTML = opts(floors, f.floor, t.allFloors);
    sel("floor").hidden = floors.length === 0;
    sel("platform").innerHTML = opts(uniq(ents.map((e) => [e.platform, e.platform])), f.platform, t.allIntegrations);

    ["exposed", "alias", "conflict"].forEach((k) => (sel(k).value = f[k]));
    ["voiceOnly", "showHidden", "showConfig"].forEach(
      (k) => (root.querySelector(`input[data-filter="${k}"]`).checked = f[k])
    );
  }

  _updateBusy() {
    this.shadowRoot.host.toggleAttribute("busy", this._busy);
  }

  _renderTable() {
    const root = this.shadowRoot;
    const t = this._t;
    const errorEl = root.getElementById("error");
    errorEl.hidden = !this._error;
    errorEl.textContent = this._error ? `${t.error}: ${this._error}` : "";
    if (!this._data) return;

    const list = this._filtered();
    const all = this._data.entities;
    const exposed = all.filter((e) => e.exposed && !e.disabled);
    const withConflict = exposed.filter((e) => e.conflicts.length);
    root.getElementById("summary").innerHTML = `
      <span><b>${list.length}</b> / ${all.length} ${esc(t.total)} ${esc(t.shown)}</span>
      <span><b>${exposed.length}</b> ${esc(t.exposedCount)}</span>
      <span class="${withConflict.length ? "warn" : ""}"><b>${withConflict.length}</b> ${esc(t.conflictCount)}</span>`;

    root.querySelectorAll("th[data-sort]").forEach((th) => {
      th.classList.toggle("sorted", th.dataset.sort === this._sort.key);
      th.dataset.dir = this._sort.dir > 0 ? "▲" : "▼";
    });

    const bulk = root.getElementById("bulk");
    bulk.hidden = this._selected.size === 0;
    root.getElementById("bulk-count").textContent = `${this._selected.size} ${t.selected}`;
    const selAll = root.getElementById("select-all");
    selAll.checked = list.length > 0 && list.every((e) => this._selected.has(e.entity_id));

    const visible = list.slice(0, this._limit);
    root.getElementById("more").hidden = list.length <= this._limit;
    root.getElementById("rows").innerHTML = visible.length
      ? visible.map((e) => this._row(e)).join("")
      : `<tr><td colspan="9" class="empty">–</td></tr>`;
  }

  _row(e) {
    const t = this._t;
    const id = esc(e.entity_id);
    const badges = [
      e.hidden ? `<span class="badge">${esc(t.hidden)}</span>` : "",
      e.disabled ? `<span class="badge">${esc(t.disabled)}</span>` : "",
      !e.in_registry ? `<span class="badge">${esc(t.noRegistry)}</span>` : "",
    ].join("");

    const aliases = e.aliases
      .map(
        (a) =>
          `<span class="chip">${esc(a)}<button class="chip-x" data-action="remove-alias" data-id="${id}" data-alias="${esc(a)}" title="✕">✕</button></span>`
      )
      .join("");
    const aliasInput = e.in_registry
      ? `<input class="alias-input" data-id="${id}" placeholder="${esc(t.addAlias)}" />`
      : "";

    const suggestions = e.suggestions.length
      ? e.suggestions
          .map(
            (s) =>
              `<button class="chip suggest ${s.level}" data-action="add-alias" data-id="${id}" data-alias="${esc(s.alias)}" title="${esc(
                s.level === "ok" ? t.suggestionOk : t.suggestionArea
              )}">+ ${esc(s.alias)}</button>`
          )
          .join("")
      : `<span class="muted">${esc(t.noSuggestions)}</span>`;

    let status;
    if (!e.conflicts.length) {
      status = `<span class="ok">✓</span>`;
    } else {
      status = e.conflicts
        .map((c) => {
          if (c.kind === "area") return `<div class="conflict warning">⚠ „${esc(c.label)}“: ${esc(t.conflictArea)}</div>`;
          const text = c.severity === "error" ? t.conflictError : t.conflictWarning;
          return `<div class="conflict ${c.severity}" title="${esc(c.other_entity_id)}">${c.severity === "error" ? "⛔" : "⚠"} „${esc(
            c.label
          )}“ – ${esc(text)} <a href="#" data-action="more-info" data-id="${esc(c.other_entity_id)}">${esc(c.other_name)}</a>${
            c.other_area ? ` (${esc(c.other_area)})` : ""
          }</div>`;
        })
        .join("");
      if (!e.exposed) status = `<div class="dim">${status}</div>`;
    }

    return `
      <tr class="${e.exposed ? "is-exposed" : ""} ${e.disabled || e.hidden ? "is-muted" : ""}">
        <td class="sel"><input type="checkbox" data-action="select" data-id="${id}" ${this._selected.has(e.entity_id) ? "checked" : ""} /></td>
        <td class="name" data-label="${esc(t.entity)}">
          <a href="#" data-action="more-info" data-id="${id}">${esc(e.name)}</a>
          <div class="sub">${id}</div>${badges}
        </td>
        <td data-label="${esc(t.type)}" class="type">
          <ha-icon icon="${esc(iconFor(e))}"></ha-icon>
          <div>${esc(e.type_label)}<div class="sub">${esc(e.domain)}${e.device_class ? ` · ${esc(e.device_class)}` : ""}</div></div>
        </td>
        <td data-label="${esc(t.device)}">${esc(e.device_name || "–")}<div class="sub">${esc(
      [e.manufacturer, e.model].filter(Boolean).join(" · ") || e.platform || ""
    )}</div></td>
        <td data-label="${esc(t.area)}">${esc(e.area_name || "–")}<div class="sub">${esc(e.floor_name || "")}</div></td>
        <td data-label="${esc(t.exposed)}">
          <label class="switch"><input type="checkbox" data-action="expose" data-id="${id}" ${e.exposed ? "checked" : ""} /><span></span></label>
        </td>
        <td data-label="${esc(t.aliases)}" class="aliases">${aliases}${aliasInput}</td>
        <td data-label="${esc(t.suggestions)}" class="suggestions">${e.in_registry ? suggestions : ""}</td>
        <td data-label="${esc(t.status)}" class="status">${status}</td>
      </tr>`;
  }

  // -------------------------------------------------------------- events ---

  _onRowClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const { action, id, alias } = el.dataset;
    if (action === "more-info") {
      ev.preventDefault();
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
    } else if (action === "add-alias") {
      this._addAlias(id, alias);
    } else if (action === "remove-alias") {
      const e = this._entity(id);
      this._update(id, { aliases: e.aliases.filter((a) => a !== alias) });
    }
  }

  _onRowChange(ev) {
    const el = ev.target;
    const { action, id } = el.dataset;
    if (action === "expose") {
      this._update(id, { exposed: el.checked });
    } else if (action === "select") {
      if (el.checked) this._selected.add(id);
      else this._selected.delete(id);
      this._renderTable();
    }
  }

  _exportPdf() {
    if (!this._data) return;
    const t = this._t;
    const lang = this._hass.language || "en";
    const html = buildExportHtml(this._data.entities, {
      t,
      lang,
      assistantLabel: t[this._assistant] || this._assistant,
      date: new Date(),
    });
    // Print via a hidden iframe – the browser's print dialog offers "Save as PDF".
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(frame);
    const doc = frame.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();
    const win = frame.contentWindow;
    const cleanup = () => setTimeout(() => frame.remove(), 1000);
    win.addEventListener("afterprint", cleanup);
    setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(cleanup, 60000); // fallback if afterprint never fires
    }, 250);
  }

  _addAlias(id, alias) {
    alias = (alias || "").trim();
    const e = this._entity(id);
    if (!alias || !e) return;
    if (e.aliases.some((a) => a.toLowerCase() === alias.toLowerCase())) return;
    this._update(id, { aliases: [...e.aliases, alias] });
  }
}

/** Printable HTML: Area → Device → Entities with aliases (only exposed, enabled entities). */
function buildExportHtml(entities, { t, lang, assistantLabel, date }) {
  const cmp = (a, b) => a.localeCompare(b, lang, { sensitivity: "base" });
  const exposed = entities.filter((e) => e.exposed && !e.disabled);

  const areas = new Map();
  for (const e of exposed) {
    const areaKey = e.area_id || "";
    if (!areas.has(areaKey)) areas.set(areaKey, { name: e.area_name || t.noArea, floor: e.floor_name, devices: new Map() });
    const devices = areas.get(areaKey).devices;
    const devKey = e.device_id || "";
    if (!devices.has(devKey))
      devices.set(devKey, {
        name: e.device_name || t.noDevice,
        sub: [e.manufacturer, e.model].filter(Boolean).join(" · "),
        entities: [],
      });
    devices.get(devKey).entities.push(e);
  }

  // Named groups alphabetically, "no area"/"no device" at the end.
  const sorted = (map) => [...map.entries()].sort(([ka, a], [kb, b]) => (!ka) - (!kb) || cmp(a.name, b.name));
  const deviceCount = [...areas.values()].reduce((n, a) => n + [...a.devices.keys()].filter(Boolean).length, 0);
  const dateStr = date.toLocaleString(lang, { dateStyle: "long", timeStyle: "short" });
  const isoDate = date.toISOString().slice(0, 10);

  const body = sorted(areas)
    .map(([, area]) => {
      const devices = sorted(area.devices)
        .map(([, dev]) => {
          const rows = dev.entities
            .sort((a, b) => cmp(a.name, b.name))
            .map(
              (e) => `<tr>
                <td class="ename">${esc(e.name)}<div class="eid">${esc(e.entity_id)}</div></td>
                <td class="etype">${esc(e.type_label)}</td>
                <td class="ealias">${e.aliases.length ? e.aliases.map((a) => `<span class="alias">${esc(a)}</span>`).join(" ") : `<span class="none">${esc(t.noAliases)}</span>`}</td>
              </tr>`
            )
            .join("");
          return `<section class="device">
              <h3>${esc(dev.name)}${dev.sub ? ` <small>${esc(dev.sub)}</small>` : ""}</h3>
              <table>
                <thead><tr><th>${esc(t.entity)}</th><th>${esc(t.type)}</th><th>${esc(t.aliases)}</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </section>`;
        })
        .join("");
      return `<section class="area">
          <h2>${esc(area.name)}${area.floor ? ` <small>${esc(area.floor)}</small>` : ""}</h2>
          ${devices}
        </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8" />
<title>${esc(t.exportFile)}-${isoDate}</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; font-size: 10pt; color: #1c1c1c; margin: 0; }
  header { border-bottom: 2px solid #03a9f4; padding-bottom: 6px; margin-bottom: 12px; }
  h1 { font-size: 18pt; margin: 0 0 2px; font-weight: 600; }
  .meta { color: #666; font-size: 9pt; }
  .area { margin-bottom: 14px; }
  h2 { font-size: 13pt; margin: 14px 0 6px; padding: 4px 8px; background: #e8f4fd; border-left: 4px solid #03a9f4; break-after: avoid; }
  h2 small, h3 small { font-weight: 400; color: #666; font-size: 9pt; }
  .device { margin: 0 0 10px 10px; break-inside: avoid; }
  h3 { font-size: 11pt; margin: 6px 0 4px; break-after: avoid; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 8.5pt; color: #666; font-weight: 500; border-bottom: 1px solid #ccc; padding: 3px 6px; }
  td { padding: 4px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  .ename { width: 38%; font-weight: 500; }
  .eid { font-weight: 400; color: #888; font-size: 8pt; font-family: Consolas, monospace; }
  .etype { width: 17%; color: #444; }
  .alias { display: inline-block; padding: 1px 7px; margin: 1px 2px 1px 0; border-radius: 9px; background: #e3f2fd; border: 1px solid #b3dbf7; font-size: 9pt; }
  .none { color: #aaa; }
  .empty { color: #666; margin-top: 24px; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
  <header>
    <h1>${esc(t.exportTitle)} – ${esc(assistantLabel)}</h1>
    <div class="meta">${esc(t.generated)} ${esc(dateStr)} · ${exposed.length} ${esc(t.total)} · ${[...areas.keys()].filter(Boolean).length} ${esc(t.areasCount)} · ${deviceCount} ${esc(t.devicesCount)}</div>
  </header>
  ${exposed.length ? body : `<p class="empty">${esc(t.nothingExposed)}</p>`}
</body>
</html>`;
}

const STYLE = `
  :host {
    display: block;
    min-height: 100vh;
    background: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    font-size: 14px;
  }
  :host([busy]) .table-wrap { opacity: .6; pointer-events: none; }
  .toolbar-top {
    display: flex; align-items: center; gap: 8px;
    height: var(--header-height, 56px); padding: 0 12px;
    background: var(--app-header-background-color, var(--primary-color));
    color: var(--app-header-text-color, #fff);
    position: sticky; top: 0; z-index: 2;
  }
  h1 { font-size: 20px; font-weight: 400; margin: 0; }
  .spacer { flex: 1; }
  .assistant { display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .assistant select { color: var(--primary-text-color); }
  .icon-btn { background: none; border: none; color: inherit; font-size: 22px; cursor: pointer; padding: 4px 8px; }
  .content { padding: 16px; }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
  input, select, button {
    font: inherit; color: var(--primary-text-color);
    background: var(--card-background-color);
    border: 1px solid var(--divider-color); border-radius: 6px; padding: 6px 8px;
  }
  #search { flex: 1 1 260px; min-width: 200px; }
  .check { display: flex; align-items: center; gap: 4px; font-size: 13px; white-space: nowrap; }
  .check input { padding: 0; }
  button { cursor: pointer; }
  button.link { border: none; background: none; color: var(--primary-color); padding: 4px; }
  .summary { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; color: var(--secondary-text-color); }
  .summary .warn b { color: var(--warning-color, #ff9800); }
  .bulk {
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    padding: 8px 12px; margin-bottom: 8px; border-radius: 8px;
    background: var(--secondary-background-color);
  }
  .error { color: var(--error-color, #db4437); margin-bottom: 8px; }
  .table-wrap {
    background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none); border: 1px solid var(--divider-color); overflow-x: auto;
  }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--divider-color); vertical-align: top; }
  th { font-weight: 500; color: var(--secondary-text-color); white-space: nowrap; position: sticky; top: 0; background: var(--card-background-color); }
  th[data-sort] { cursor: pointer; user-select: none; }
  th.sorted::after { content: " " attr(data-dir); }
  td.sel, th.sel { width: 28px; }
  tr.is-muted td { opacity: .55; }
  .name a { color: var(--primary-text-color); font-weight: 500; text-decoration: none; }
  .name a:hover { text-decoration: underline; }
  .sub { font-size: 12px; color: var(--secondary-text-color); word-break: break-all; }
  .badge { display: inline-block; font-size: 11px; padding: 1px 6px; margin: 2px 4px 0 0; border-radius: 8px; background: var(--secondary-background-color); color: var(--secondary-text-color); }
  .chip {
    display: inline-flex; align-items: center; gap: 4px; margin: 2px 4px 2px 0;
    padding: 2px 8px; border-radius: 12px; font-size: 12px;
    background: rgba(var(--rgb-primary-color, 3,169,244), .15); border: 1px solid transparent;
  }
  .chip-x { border: none; background: none; padding: 0 2px; font-size: 11px; color: var(--secondary-text-color); }
  .chip.suggest { cursor: pointer; background: none; border: 1px dashed var(--divider-color); }
  .chip.suggest.ok { border-color: var(--success-color, #43a047); color: var(--success-color, #43a047); }
  .chip.suggest.area { border-color: var(--warning-color, #ff9800); color: var(--warning-color, #ff9800); }
  .chip.suggest:hover { background: var(--secondary-background-color); }
  .alias-input { width: 140px; padding: 3px 6px; font-size: 12px; margin-top: 2px; }
  .aliases { min-width: 180px; }
  .suggestions { min-width: 160px; }
  .status { min-width: 160px; font-size: 12px; }
  .conflict { margin-bottom: 4px; }
  .conflict.error { color: var(--error-color, #db4437); }
  .conflict.warning { color: var(--warning-color, #ff9800); }
  .conflict a { color: inherit; }
  .dim { opacity: .55; }
  .ok { color: var(--success-color, #43a047); }
  td.type { white-space: nowrap; }
  td.type > * { vertical-align: top; display: inline-block; }
  td.type ha-icon { --mdc-icon-size: 22px; color: var(--state-icon-color, var(--paper-item-icon-color, #44739e)); margin-right: 8px; }
  tr.is-exposed td.type ha-icon { color: var(--state-active-color, var(--primary-color)); }
  .export-btn { background: none; border: 1px solid currentColor; color: inherit; font-size: 13px; padding: 4px 10px; border-radius: 6px; }
  .muted { color: var(--secondary-text-color); }
  .empty { text-align: center; color: var(--secondary-text-color); padding: 24px; }
  .more { text-align: center; margin: 12px 0; }
  .switch { position: relative; display: inline-block; width: 36px; height: 20px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .switch span { position: absolute; inset: 0; border-radius: 10px; background: var(--disabled-color, #bdbdbd); transition: .2s; cursor: pointer; }
  .switch span::before { content: ""; position: absolute; width: 16px; height: 16px; left: 2px; top: 2px; border-radius: 50%; background: #fff; transition: .2s; }
  .switch input:checked + span { background: var(--primary-color); }
  .switch input:checked + span::before { transform: translateX(16px); }

  @media (max-width: 900px) {
    .content { padding: 8px; }
    thead { display: none; }
    table, tbody, tr, td { display: block; width: 100%; box-sizing: border-box; }
    tr { border-bottom: 1px solid var(--divider-color); padding: 8px 0; position: relative; }
    td { border: none; padding: 4px 12px; }
    td[data-label]::before { content: attr(data-label); display: block; font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    td.sel { position: absolute; right: 4px; top: 8px; width: auto; }
    td.name::before { display: none; }
  }
`;

customElements.define("voice-entity-panel", VoiceEntityPanel);
