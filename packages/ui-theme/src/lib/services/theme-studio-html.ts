/**
 * Generates the complete self-contained HTML document for the Theme Studio popup.
 *
 * The returned string is a full HTML page with inline CSS and JS.
 * It communicates with the opener window via `postMessage` and
 * `opener.document.documentElement.style.setProperty()`.
 *
 * @internal
 */
export function generateThemeStudioHtml(): string {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Theme Studio — @theredhead</title>
<style>
${STUDIO_CSS}
</style>
</head>
<body>
<div id="app">
  <header class="ts-header">
    <h1 class="ts-title">Theme Studio</h1>
    <div class="ts-header-actions">
      <button class="ts-btn ts-btn--outline" id="btnResetAll" title="Reset all overrides">Reset All</button>
      <button class="ts-btn ts-btn--outline" id="btnExportCss" title="Export CSS override stylesheet">Export CSS</button>
      <button class="ts-btn ts-btn--outline" id="btnExportJson" title="Export overrides as JSON">Export JSON</button>
      <button class="ts-btn ts-btn--outline" id="btnImportJson" title="Import overrides from JSON">Import JSON</button>
      <input type="file" id="fileImport" accept=".json" hidden />
    </div>
  </header>

  <div class="ts-toolbar">
    <input type="search" id="searchInput" class="ts-search" placeholder="Search tokens by name, description, component…" autocomplete="off" />
    <select id="filterType" class="ts-select">
      <option value="">All types</option>
      <option value="color">Color</option>
      <option value="length">Length</option>
      <option value="font">Font</option>
      <option value="shadow">Shadow</option>
      <option value="number">Number</option>
      <option value="string">String</option>
      <option value="reference">Reference</option>
      <option value="keyword">Keyword</option>
    </select>
    <select id="filterScope" class="ts-select">
      <option value="">All scopes</option>
      <option value="global">Global</option>
      <option value="component">Component</option>
    </select>
    <select id="filterNamespace" class="ts-select">
      <option value="">All namespaces</option>
    </select>
    <label class="ts-label-inline">
      <input type="checkbox" id="chkModifiedOnly" /> Modified only
    </label>
  </div>

  <div class="ts-stats" id="statsBar"></div>

  <main class="ts-main" id="tokenContainer"></main>
</div>

<div id="exportModal" class="ts-modal" hidden>
  <div class="ts-modal-backdrop"></div>
  <div class="ts-modal-content">
    <h2 class="ts-modal-title" id="modalTitle">Export</h2>
    <textarea class="ts-modal-textarea" id="modalTextarea" readonly></textarea>
    <div class="ts-modal-actions">
      <button class="ts-btn" id="modalCopy">Copy to Clipboard</button>
      <button class="ts-btn ts-btn--outline" id="modalClose">Close</button>
    </div>
  </div>
</div>

<script>
${STUDIO_JS}
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline CSS for the popup (completely isolated from the host app)
// ─────────────────────────────────────────────────────────────────────────────
const STUDIO_CSS = /* css */ `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ts-bg: #f5f6f8;
    --ts-surface: #ffffff;
    --ts-text: #1d232b;
    --ts-text-muted: #6b7280;
    --ts-border: #d7dce2;
    --ts-accent: #3584e4;
    --ts-accent-hover: #2a6fca;
    --ts-accent-contrast: #ffffff;
    --ts-group-bg: #eef1f5;
    --ts-input-bg: #ffffff;
    --ts-input-border: #cdd3da;
    --ts-shadow: 0 1px 3px rgba(0,0,0,0.08);
    --ts-radius: 6px;
    --ts-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --ts-modified-bg: #fffbe6;
    --ts-modified-border: #f0c000;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --ts-bg: #1a1d23;
      --ts-surface: #23272e;
      --ts-text: #e8ecf0;
      --ts-text-muted: #9ca3af;
      --ts-border: #3a3f47;
      --ts-accent: #7ab0ff;
      --ts-accent-hover: #5a9bf0;
      --ts-accent-contrast: #1e2128;
      --ts-group-bg: #1e2228;
      --ts-input-bg: #2a2f38;
      --ts-input-border: #4a5060;
      --ts-shadow: 0 1px 3px rgba(0,0,0,0.3);
      --ts-modified-bg: #332d10;
      --ts-modified-border: #b89b00;
    }
  }

  html, body {
    height: 100%;
    font-family: var(--ts-font);
    font-size: 13px;
    line-height: 1.5;
    color: var(--ts-text);
    background: var(--ts-bg);
  }

  #app { display: flex; flex-direction: column; height: 100%; }

  /* ── Header ── */
  .ts-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px;
    background: var(--ts-surface);
    border-bottom: 1px solid var(--ts-border);
    flex-shrink: 0;
  }
  .ts-title { font-size: 15px; font-weight: 700; }
  .ts-header-actions { display: flex; gap: 6px; }

  /* ── Buttons ── */
  .ts-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 12px; border-radius: var(--ts-radius);
    font-size: 12px; font-weight: 500; font-family: inherit;
    cursor: pointer; border: 1px solid var(--ts-accent);
    color: var(--ts-accent-contrast); background: var(--ts-accent);
    transition: background 0.15s, border-color 0.15s;
  }
  .ts-btn:hover { background: var(--ts-accent-hover); border-color: var(--ts-accent-hover); }
  .ts-btn--outline {
    color: var(--ts-accent); background: transparent;
  }
  .ts-btn--outline:hover { background: var(--ts-accent); color: var(--ts-accent-contrast); }
  .ts-btn--sm { padding: 2px 8px; font-size: 11px; }
  .ts-btn--danger { border-color: #dc3545; color: #dc3545; background: transparent; }
  .ts-btn--danger:hover { background: #dc3545; color: #fff; }

  /* ── Toolbar ── */
  .ts-toolbar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px;
    background: var(--ts-surface);
    border-bottom: 1px solid var(--ts-border);
    flex-shrink: 0; flex-wrap: wrap;
  }
  .ts-search {
    flex: 1; min-width: 200px;
    padding: 6px 10px; border-radius: var(--ts-radius);
    border: 1px solid var(--ts-input-border);
    background: var(--ts-input-bg); color: var(--ts-text);
    font-family: inherit; font-size: 13px;
  }
  .ts-search:focus { outline: 2px solid var(--ts-accent); outline-offset: -1px; }
  .ts-select {
    padding: 6px 8px; border-radius: var(--ts-radius);
    border: 1px solid var(--ts-input-border);
    background: var(--ts-input-bg); color: var(--ts-text);
    font-family: inherit; font-size: 12px;
  }
  .ts-label-inline {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; color: var(--ts-text-muted); white-space: nowrap;
    cursor: pointer;
  }

  /* ── Stats bar ── */
  .ts-stats {
    padding: 4px 16px; font-size: 11px; color: var(--ts-text-muted);
    background: var(--ts-surface); border-bottom: 1px solid var(--ts-border);
    flex-shrink: 0;
  }

  /* ── Main scrollable area ── */
  .ts-main {
    flex: 1; overflow-y: auto; padding: 12px 16px;
  }

  /* ── Group (namespace / component) ── */
  .ts-group {
    margin-bottom: 16px;
    border: 1px solid var(--ts-border);
    border-radius: var(--ts-radius);
    overflow: hidden;
  }
  .ts-group-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px;
    background: var(--ts-group-bg);
    font-weight: 600; font-size: 13px;
    cursor: pointer; user-select: none;
  }
  .ts-group-header:hover { filter: brightness(0.97); }
  .ts-group-badge {
    font-size: 11px; font-weight: 400;
    color: var(--ts-text-muted);
  }
  .ts-group-body { display: block; }
  .ts-group.collapsed .ts-group-body { display: none; }

  /* ── Token row ── */
  .ts-token {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(120px, auto) minmax(100px, auto) auto;
    gap: 8px;
    align-items: center;
    padding: 6px 12px;
    border-top: 1px solid var(--ts-border);
    transition: background 0.1s;
  }
  .ts-token:hover { background: var(--ts-group-bg); }
  .ts-token.modified {
    background: var(--ts-modified-bg);
    border-left: 3px solid var(--ts-modified-border);
    padding-left: 9px;
  }
  .ts-token-info {}
  .ts-token-name {
    font-family: "SF Mono", "Fira Code", "Consolas", monospace;
    font-size: 12px; font-weight: 500;
    word-break: break-all;
  }
  .ts-token-desc {
    font-size: 11px; color: var(--ts-text-muted);
    margin-top: 1px;
  }
  .ts-token-meta {
    font-size: 10px; color: var(--ts-text-muted);
    display: flex; gap: 6px; margin-top: 2px;
  }
  .ts-token-meta span {
    background: var(--ts-bg); padding: 1px 5px;
    border-radius: 3px; border: 1px solid var(--ts-border);
  }

  /* ── Editor cells ── */
  .ts-token-editor { display: flex; align-items: center; gap: 6px; }
  .ts-color-swatch {
    width: 28px; height: 28px;
    border: 1px solid var(--ts-input-border);
    border-radius: 4px; cursor: pointer;
    padding: 0; background: none;
  }
  .ts-color-swatch input[type="color"] {
    width: 100%; height: 100%;
    border: none; padding: 0; cursor: pointer;
    background: none; border-radius: 3px;
  }
  .ts-input {
    width: 100%; max-width: 180px;
    padding: 4px 8px; border-radius: 4px;
    border: 1px solid var(--ts-input-border);
    background: var(--ts-input-bg); color: var(--ts-text);
    font-family: "SF Mono", "Fira Code", "Consolas", monospace;
    font-size: 12px;
  }
  .ts-input:focus { outline: 2px solid var(--ts-accent); outline-offset: -1px; }

  .ts-token-preview {
    width: 32px; height: 32px;
    border: 1px solid var(--ts-input-border);
    border-radius: 4px;
  }
  .ts-token-actions { display: flex; gap: 4px; justify-content: flex-end; }

  /* ── Modal ── */
  .ts-modal {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  }
  .ts-modal[hidden] { display: none; }
  .ts-modal-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
  }
  .ts-modal-content {
    position: relative;
    width: 90%; max-width: 700px; max-height: 80vh;
    display: flex; flex-direction: column; gap: 12px;
    padding: 20px;
    background: var(--ts-surface);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }
  .ts-modal-title { font-size: 16px; font-weight: 700; }
  .ts-modal-textarea {
    flex: 1; min-height: 300px;
    padding: 12px; border-radius: var(--ts-radius);
    border: 1px solid var(--ts-input-border);
    background: var(--ts-input-bg); color: var(--ts-text);
    font-family: "SF Mono", "Fira Code", "Consolas", monospace;
    font-size: 12px; line-height: 1.6;
    resize: vertical;
  }
  .ts-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

  /* ── Empty state ── */
  .ts-empty {
    padding: 40px; text-align: center;
    color: var(--ts-text-muted); font-size: 14px;
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .ts-token {
      grid-template-columns: 1fr;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Inline JS for the popup
// ─────────────────────────────────────────────────────────────────────────────
const STUDIO_JS = /* js */ `
"use strict";

// ── State ──
let manifest = null;
const overrides = new Map();  // name → value
let tokens = [];
let filteredTokens = [];

// ── DOM refs ──
const searchInput     = document.getElementById("searchInput");
const filterType      = document.getElementById("filterType");
const filterScope     = document.getElementById("filterScope");
const filterNamespace = document.getElementById("filterNamespace");
const chkModifiedOnly = document.getElementById("chkModifiedOnly");
const tokenContainer  = document.getElementById("tokenContainer");
const statsBar        = document.getElementById("statsBar");
const exportModal     = document.getElementById("exportModal");
const modalTitle      = document.getElementById("modalTitle");
const modalTextarea   = document.getElementById("modalTextarea");
const modalCopy       = document.getElementById("modalCopy");
const modalClose      = document.getElementById("modalClose");
const btnResetAll     = document.getElementById("btnResetAll");
const btnExportCss    = document.getElementById("btnExportCss");
const btnExportJson   = document.getElementById("btnExportJson");
const btnImportJson   = document.getElementById("btnImportJson");
const fileImport      = document.getElementById("fileImport");

// ── Communication with opener ──
function applyToOpener(name, value) {
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.document.documentElement.style.setProperty(name, value);
    }
  } catch (e) { /* cross-origin safety */ }
}

function removeFromOpener(name) {
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.document.documentElement.style.removeProperty(name);
    }
  } catch (e) { /* cross-origin safety */ }
}

function getComputedFromOpener(name) {
  try {
    if (window.opener && !window.opener.closed) {
      return window.opener.getComputedStyle(window.opener.document.documentElement).getPropertyValue(name).trim();
    }
  } catch (e) { /* cross-origin safety */ }
  return "";
}

// ── Receive manifest from opener ──
window.addEventListener("message", function onMsg(e) {
  if (e.data && e.data.type === "theredhead-theme-studio-manifest") {
    manifest = e.data.manifest;
    tokens = manifest.tokens || [];
    initNamespaceFilter();
    applyFilters();
    window.removeEventListener("message", onMsg);
  }
});

// Ask opener to send manifest
if (window.opener && !window.opener.closed) {
  window.opener.postMessage({ type: "theredhead-theme-studio-ready" }, "*");
}

// ── Namespace filter population ──
function initNamespaceFilter() {
  const nss = [...new Set(tokens.map(function (t) { return t.namespace; }))].sort();
  nss.forEach(function (ns) {
    const opt = document.createElement("option");
    opt.value = ns;
    opt.textContent = ns + " — " + (manifest.namespaces[ns] || ns);
    filterNamespace.appendChild(opt);
  });
}

// ── Filtering ──
function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  const tType = filterType.value;
  const tScope = filterScope.value;
  const tNs = filterNamespace.value;
  const modOnly = chkModifiedOnly.checked;

  filteredTokens = tokens.filter(function (t) {
    if (tType && t.type !== tType) return false;
    if (tScope && t.scope !== tScope) return false;
    if (tNs && t.namespace !== tNs) return false;
    if (modOnly && !overrides.has(t.name)) return false;
    if (q) {
      var haystack = (t.name + " " + t.description + " " + t.namespace + " " +
        (t.definitions || []).map(function (d) { return d.owner; }).join(" ")).toLowerCase();
      if (haystack.indexOf(q) === -1) return false;
    }
    return true;
  });

  render();
  updateStats();
}

// ── Stats ──
function updateStats() {
  var total = tokens.length;
  var shown = filteredTokens.length;
  var mod = overrides.size;
  statsBar.textContent = shown + " of " + total + " tokens shown" +
    (mod > 0 ? " · " + mod + " modified" : "");
}

// ── Determine current theme mode ──
function getOpenerIsDark() {
  try {
    if (window.opener && !window.opener.closed) {
      return window.opener.document.documentElement.classList.contains("dark-theme");
    }
  } catch (e) {}
  return false;
}

// ── Get the default value for a token ──
function getDefaultValue(token) {
  var isDark = getOpenerIsDark();
  if (isDark && token.values.dark) return token.values.dark;
  if (!isDark && token.values.light) return token.values.light;
  return token.values.light || token.values.dark || "";
}

// ── Render ──
function render() {
  // Group tokens: global tokens by semantic prefix, component tokens by namespace
  var groups = {};
  filteredTokens.forEach(function (t) {
    var key;
    if (t.scope === "component") {
      key = t.namespace;
    } else {
      // group by second segment: --ui-accent-* → "accent", --ui-surface-* → "surface"
      var parts = t.name.replace(/^--ui-/, "").split("-");
      key = "ui:" + parts[0];
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  // Sort groups: "ui:*" first (alphabetical), then component namespaces
  var keys = Object.keys(groups).sort(function (a, b) {
    var aG = a.startsWith("ui:") ? 0 : 1;
    var bG = b.startsWith("ui:") ? 0 : 1;
    if (aG !== bG) return aG - bG;
    return a.localeCompare(b);
  });

  if (keys.length === 0) {
    tokenContainer.innerHTML = '<div class="ts-empty">No tokens match your search.</div>';
    return;
  }

  var html = "";
  keys.forEach(function (key) {
    var toks = groups[key];
    var label = key.startsWith("ui:") ?
      "Global — " + key.split(":")[1] :
      (manifest.namespaces[key] || key);

    html += '<div class="ts-group" data-group="' + esc(key) + '">';
    html += '<div class="ts-group-header" onclick="toggleGroup(this)">';
    html += '<span>' + esc(label) + '</span>';
    html += '<span class="ts-group-badge">' + toks.length + ' token' + (toks.length !== 1 ? 's' : '') + '</span>';
    html += '</div>';
    html += '<div class="ts-group-body">';

    toks.forEach(function (t) {
      var isModified = overrides.has(t.name);
      var currentVal = isModified ? overrides.get(t.name) : getDefaultValue(t);
      var owners = [...new Set((t.definitions || []).map(function (d) { return d.owner; }))];

      html += '<div class="ts-token' + (isModified ? ' modified' : '') + '" data-token="' + esc(t.name) + '">';

      // Info cell
      html += '<div class="ts-token-info">';
      html += '<div class="ts-token-name">' + esc(t.name) + '</div>';
      html += '<div class="ts-token-desc">' + esc(t.description) + '</div>';
      html += '<div class="ts-token-meta">';
      html += '<span>' + esc(t.type) + '</span>';
      html += '<span>' + esc(t.scope) + '</span>';
      if (owners.length) html += '<span>' + esc(owners.join(", ")) + '</span>';
      html += '</div></div>';

      // Editor cell
      html += '<div class="ts-token-editor">';
      if (t.type === "color") {
        html += '<div class="ts-color-swatch">';
        html += '<input type="color" value="' + esc(toHex6(currentVal)) + '" data-name="' + esc(t.name) + '" onchange="onColorChange(this)" oninput="onColorChange(this)" />';
        html += '</div>';
      }
      html += '<input type="text" class="ts-input" value="' + esc(currentVal) + '" data-name="' + esc(t.name) + '" data-type="' + esc(t.type) + '" onchange="onTextChange(this)" />';
      html += '</div>';

      // Preview cell (for colors)
      if (t.type === "color") {
        html += '<div class="ts-token-preview" style="background:' + esc(currentVal) + '"></div>';
      } else {
        html += '<div></div>';
      }

      // Actions cell
      html += '<div class="ts-token-actions">';
      if (isModified) {
        html += '<button class="ts-btn ts-btn--sm ts-btn--danger" onclick="resetToken(' + "'" + esc(t.name) + "'" + ')">Reset</button>';
      }
      html += '</div>';

      html += '</div>';
    });

    html += '</div></div>';
  });

  tokenContainer.innerHTML = html;
}

// ── Interaction handlers ──
window.toggleGroup = function (headerEl) {
  headerEl.parentElement.classList.toggle("collapsed");
};

window.onColorChange = function (input) {
  var name = input.dataset.name;
  var value = input.value;
  overrides.set(name, value);
  applyToOpener(name, value);

  // Sync the text input in the same row
  var row = input.closest(".ts-token");
  var textInput = row.querySelector('.ts-input');
  if (textInput) textInput.value = value;

  // Update preview
  var preview = row.querySelector('.ts-token-preview');
  if (preview) preview.style.background = value;

  // Mark modified
  row.classList.add("modified");

  // Add reset button if not present
  ensureResetButton(row, name);
  updateStats();
};

window.onTextChange = function (input) {
  var name = input.dataset.name;
  var value = input.value.trim();
  if (!value) return;

  overrides.set(name, value);
  applyToOpener(name, value);

  var row = input.closest(".ts-token");

  // Sync color picker if present
  var colorInput = row.querySelector('input[type="color"]');
  if (colorInput && input.dataset.type === "color") {
    var hex = toHex6(value);
    if (hex.match(/^#[0-9a-f]{6}$/i)) colorInput.value = hex;
  }

  // Update preview
  var preview = row.querySelector('.ts-token-preview');
  if (preview) preview.style.background = value;

  row.classList.add("modified");
  ensureResetButton(row, name);
  updateStats();
};

window.resetToken = function (name) {
  overrides.delete(name);
  removeFromOpener(name);
  applyFilters(); // re-render
};

function ensureResetButton(row, name) {
  var actions = row.querySelector('.ts-token-actions');
  if (!actions.querySelector('button')) {
    actions.innerHTML = '<button class="ts-btn ts-btn--sm ts-btn--danger" onclick="resetToken(\\'' + esc(name) + '\\')">Reset</button>';
  }
}

// ── Reset All ──
btnResetAll.addEventListener("click", function () {
  overrides.forEach(function (_v, name) {
    removeFromOpener(name);
  });
  overrides.clear();
  applyFilters();
});

// ── Export CSS ──
btnExportCss.addEventListener("click", function () {
  if (overrides.size === 0) {
    showModal("Export CSS", "/* No overrides to export. Modify some tokens first. */");
    return;
  }
  var isDark = getOpenerIsDark();
  var lines = [];
  lines.push("/**");
  lines.push(" * @theredhead Theme Override");
  lines.push(" * Generated by Theme Studio on " + new Date().toISOString().split("T")[0]);
  lines.push(" * Mode: " + (isDark ? "dark" : "light"));
  lines.push(" * Tokens modified: " + overrides.size);
  lines.push(" */");
  lines.push("");
  lines.push(":root {");
  overrides.forEach(function (value, name) {
    lines.push("  " + name + ": " + value + ";");
  });
  lines.push("}");
  showModal("Export CSS — " + overrides.size + " override(s)", lines.join("\\n"));
});

// ── Export JSON ──
btnExportJson.addEventListener("click", function () {
  var data = {
    $schema: "theredhead-theme-override",
    generated: new Date().toISOString(),
    mode: getOpenerIsDark() ? "dark" : "light",
    overrides: {}
  };
  overrides.forEach(function (value, name) { data.overrides[name] = value; });
  showModal("Export JSON — " + overrides.size + " override(s)", JSON.stringify(data, null, 2));
});

// ── Import JSON ──
btnImportJson.addEventListener("click", function () { fileImport.click(); });
fileImport.addEventListener("change", function () {
  var file = fileImport.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      var imported = data.overrides || data;
      var count = 0;
      Object.keys(imported).forEach(function (name) {
        if (typeof imported[name] === "string" && name.startsWith("--")) {
          overrides.set(name, imported[name]);
          applyToOpener(name, imported[name]);
          count++;
        }
      });
      applyFilters();
      alert("Imported " + count + " token override(s).");
    } catch (err) {
      alert("Failed to parse JSON: " + err.message);
    }
  };
  reader.readAsText(file);
  fileImport.value = "";
});

// ── Modal ──
function showModal(title, text) {
  modalTitle.textContent = title;
  modalTextarea.value = text;
  exportModal.hidden = false;
}

modalClose.addEventListener("click", function () { exportModal.hidden = true; });
document.querySelector(".ts-modal-backdrop").addEventListener("click", function () { exportModal.hidden = true; });

modalCopy.addEventListener("click", function () {
  modalTextarea.select();
  navigator.clipboard.writeText(modalTextarea.value).then(function () {
    modalCopy.textContent = "Copied!";
    setTimeout(function () { modalCopy.textContent = "Copy to Clipboard"; }, 1500);
  });
});

// ── Filter event wiring ──
searchInput.addEventListener("input", debounce(applyFilters, 150));
filterType.addEventListener("change", applyFilters);
filterScope.addEventListener("change", applyFilters);
filterNamespace.addEventListener("change", applyFilters);
chkModifiedOnly.addEventListener("change", applyFilters);

// ── Utilities ──
function esc(s) {
  if (typeof s !== "string") return "";
  var el = document.createElement("span");
  el.textContent = s;
  return el.innerHTML;
}

function toHex6(val) {
  if (!val) return "#000000";
  val = val.trim();
  // Already hex
  if (/^#[0-9a-f]{6}$/i.test(val)) return val;
  if (/^#[0-9a-f]{3}$/i.test(val)) {
    return "#" + val[1]+val[1] + val[2]+val[2] + val[3]+val[3];
  }
  // Try to parse rgb()/rgba()
  var m = val.match(/rgba?\\(\\s*(\\d+)[\\s,]+(\\d+)[\\s,]+(\\d+)/);
  if (m) {
    return "#" + [m[1],m[2],m[3]].map(function(c) {
      return parseInt(c,10).toString(16).padStart(2,"0");
    }).join("");
  }
  // Named colors via a temporary element
  var tmp = document.createElement("div");
  tmp.style.color = val;
  document.body.appendChild(tmp);
  var computed = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);
  m = computed.match(/rgba?\\(\\s*(\\d+)[\\s,]+(\\d+)[\\s,]+(\\d+)/);
  if (m) {
    return "#" + [m[1],m[2],m[3]].map(function(c) {
      return parseInt(c,10).toString(16).padStart(2,"0");
    }).join("");
  }
  return "#000000";
}

function debounce(fn, ms) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// ── Keyboard shortcut ──
document.addEventListener("keydown", function (e) {
  // Esc closes modal
  if (e.key === "Escape" && !exportModal.hidden) {
    exportModal.hidden = true;
    e.preventDefault();
  }
  // Ctrl/Cmd+F focuses search
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});
`;
