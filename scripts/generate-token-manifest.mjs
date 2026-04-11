#!/usr/bin/env node

/**
 * generate-token-manifest.mjs
 *
 * Scans all SCSS / inline-style TypeScript files in packages/ for CSS custom
 * property definitions, classifies their value type, determines ownership,
 * and writes a structured JSON manifest to `css-token-manifest.json`.
 *
 * Usage:  node scripts/generate-token-manifest.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PACKAGES_DIR = join(ROOT, "packages");
const OUT = join(ROOT, "css-token-manifest.json");

// ── File discovery ─────────────────────────────────────────────────

function walk(dir, exts, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === "dev-docs") continue;
    if (statSync(full).isDirectory()) {
      walk(full, exts, results);
    } else if (exts.some((e) => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

// ── Value-type inference ───────────────────────────────────────────

function inferType(value) {
  const v = value.trim();

  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return "color";
  if (/^rgba?\(/.test(v)) return "color";
  if (/^hsla?\(/.test(v)) return "color";
  if (/^color-mix\(/.test(v)) return "color";
  if (/^var\(--ui-accent/.test(v)) return "color";
  if (/^transparent$/.test(v)) return "color";

  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(v)) return "length";
  if (/^min\(|^max\(|^calc\(|^clamp\(/.test(v)) return "length";
  if (/^\d+(\.\d+)?rem\s/.test(v)) return "length";

  if (/^0(\.\d+)?$/.test(v) || /^1(\.\d)?$/.test(v)) return "number";

  if (/^system-ui|^inherit|^monospace|^\d+(\.\d+)?(rem|em|px)\s/.test(v))
    return "font";

  if (/box-shadow|^\d+\w+ \d+\w+ \d/.test(v)) return "shadow";
  if (/^0 \d/.test(v)) return "shadow";
  if (/shadow/.test(v)) return "shadow";

  if (/^var\(/.test(v)) {
    if (/color|accent|text|bg|surface|border|brand/.test(v)) return "color";
    if (/shadow/.test(v)) return "shadow";
    if (/secondary|tertiary/.test(v)) return "color";
    return "reference";
  }

  if (/^none$/.test(v)) return "keyword";
  if (/^(solid|dashed|dotted)$/.test(v)) return "keyword";

  return "string";
}

// ── Component / owner inference ────────────────────────────────────

const COMPONENT_MAP = {
  "_tokens.scss": { owner: "ThemeService", pkg: "@theredhead/lucid-theme" },
  "_elevation.scss": { owner: "ThemeService", pkg: "@theredhead/lucid-theme" },
  "button.component": { owner: "UIButton", pkg: "@theredhead/lucid-kit" },
  "input.component": { owner: "UIInput", pkg: "@theredhead/lucid-kit" },
  "select.component": { owner: "UISelect", pkg: "@theredhead/lucid-kit" },
  "autocomplete.component": {
    owner: "UIAutocomplete",
    pkg: "@theredhead/lucid-kit",
  },
  "filter.component": { owner: "UIFilter", pkg: "@theredhead/lucid-kit" },
  "table-view.component": { owner: "UITableView", pkg: "@theredhead/lucid-kit" },
  "table-view-caption": { owner: "UITableViewCaption", pkg: "@theredhead/lucid-kit" },
  "badge-column": { owner: "UIBadgeColumn", pkg: "@theredhead/lucid-kit" },
  "badge.component": { owner: "UIBadge", pkg: "@theredhead/lucid-kit" },
  "slider.component": { owner: "UISlider", pkg: "@theredhead/lucid-kit" },
  "progress-bar": { owner: "UIProgressBar", pkg: "@theredhead/lucid-kit" },
  "toggle.component": { owner: "UIToggle", pkg: "@theredhead/lucid-kit" },
  "tooltip": { owner: "UITooltip", pkg: "@theredhead/lucid-kit" },
  "chip.component": { owner: "UIChip", pkg: "@theredhead/lucid-kit" },
  "avatar.component": { owner: "UIAvatar", pkg: "@theredhead/lucid-kit" },
  "card.component": { owner: "UICard", pkg: "@theredhead/lucid-kit" },
  "tabs.component": { owner: "UITabs", pkg: "@theredhead/lucid-kit" },
  "clock.component": { owner: "UIClock", pkg: "@theredhead/lucid-kit" },
  "dialog.component": { owner: "UIDialog", pkg: "@theredhead/lucid-kit" },
  "dialog-header": { owner: "UIDialogHeader", pkg: "@theredhead/lucid-kit" },
  "dialog-body": { owner: "UIDialogBody", pkg: "@theredhead/lucid-kit" },
  "dialog-footer": { owner: "UIDialogFooter", pkg: "@theredhead/lucid-kit" },
  "dialog.service": { owner: "ModalService", pkg: "@theredhead/lucid-kit" },
  "drawer.component": { owner: "UIDrawer", pkg: "@theredhead/lucid-kit" },
  "dropdown": { owner: "UIDropdownList", pkg: "@theredhead/lucid-kit" },
  "toast": { owner: "UIToast", pkg: "@theredhead/lucid-kit" },
  "calendar.component": { owner: "UICalendar", pkg: "@theredhead/lucid-kit" },
  "timeline.component": { owner: "UITimeline", pkg: "@theredhead/lucid-kit" },
  "map-view": { owner: "UIMapView", pkg: "@theredhead/lucid-kit" },
  "chart.component": { owner: "UIChart", pkg: "@theredhead/lucid-kit" },
  "gauge": { owner: "UIGauge", pkg: "@theredhead/lucid-kit" },
  "gantt": { owner: "UIGanttChart", pkg: "@theredhead/lucid-kit" },
  "image.component": { owner: "UIImage", pkg: "@theredhead/lucid-kit" },
  "loading-bar": { owner: "UILoadingBar", pkg: "@theredhead/lucid-kit" },
  "tree-view": { owner: "UITreeView", pkg: "@theredhead/lucid-kit" },
  "rich-text": { owner: "UIRichTextEditor", pkg: "@theredhead/lucid-kit" },
  "density.component": { owner: "UIDensity", pkg: "@theredhead/lucid-kit" },
  "color-picker": { owner: "UIColorPicker", pkg: "@theredhead/lucid-kit" },
  "emoji-picker": { owner: "UIEmojiPicker", pkg: "@theredhead/lucid-kit" },
  "video-player": { owner: "UIVideoPlayer", pkg: "@theredhead/lucid-kit" },
  "carousel": { owner: "UICarousel", pkg: "@theredhead/lucid-kit" },
  "upload": { owner: "UIUpload", pkg: "@theredhead/lucid-kit" },
  "infinite-scroll": { owner: "UIInfiniteScroll", pkg: "@theredhead/lucid-kit" },
  "sidebar": { owner: "UISidebar", pkg: "@theredhead/lucid-kit" },

  "master-detail-view": {
    owner: "UIMasterDetailView",
    pkg: "@theredhead/lucid-blocks",
  },
  "search-view": { owner: "UISearchView", pkg: "@theredhead/lucid-blocks" },
  "chat-view": { owner: "UIChatView", pkg: "@theredhead/lucid-blocks" },
  "wizard.component": { owner: "UIWizard", pkg: "@theredhead/lucid-blocks" },
  "dashboard.component": { owner: "UIDashboard", pkg: "@theredhead/lucid-blocks" },
  "dashboard-panel": {
    owner: "UIDashboardPanel",
    pkg: "@theredhead/lucid-blocks",
  },
  "command-palette": {
    owner: "UICommandPalette",
    pkg: "@theredhead/lucid-blocks",
  },
  "file-browser": { owner: "UIFileBrowser", pkg: "@theredhead/lucid-blocks" },
  "kanban-board": { owner: "UIKanbanBoard", pkg: "@theredhead/lucid-blocks" },
  "navigation-page": {
    owner: "UINavigationPage",
    pkg: "@theredhead/lucid-blocks",
  },
  "property-sheet": {
    owner: "UIPropertySheet",
    pkg: "@theredhead/lucid-blocks",
  },

  "form-designer": { owner: "UIFormDesigner", pkg: "@theredhead/lucid-forms" },
  "form-field": { owner: "UIFormField", pkg: "@theredhead/lucid-forms" },
};

function resolveOwner(filePath) {
  const rel = relative(ROOT, filePath);
  for (const [pattern, info] of Object.entries(COMPONENT_MAP)) {
    if (rel.includes(pattern)) return info;
  }
  // Fallback: extract from file path
  const dir = basename(dirname(filePath));
  return {
    owner: dir,
    pkg: rel.includes("ui-kit")
      ? "@theredhead/lucid-kit"
      : rel.includes("ui-blocks")
        ? "@theredhead/lucid-blocks"
        : rel.includes("ui-forms")
          ? "@theredhead/lucid-forms"
          : rel.includes("ui-theme")
            ? "@theredhead/lucid-theme"
            : rel.includes("foundation")
              ? "@theredhead/lucid-foundation"
              : "unknown",
  };
}

// ── Human-readable descriptions ────────────────────────────────────

const DESCRIPTIONS = {
  // ── Core colours ──
  "--ui-text": "Primary text colour for all components",
  "--ui-text-muted": "Subdued text colour for secondary / helper text",
  "--ui-muted": "Muted foreground colour (legacy alias for --ui-text-muted)",
  "--ui-accent": "Primary accent / brand colour used for interactive elements",
  "--ui-accent-hover":
    "Hover state of the accent colour (auto-derived via color-mix)",
  "--ui-accent-contrast":
    "Foreground colour readable on top of --ui-accent backgrounds",
  "--ui-link": "Text colour for hyperlinks",
  "--ui-link-hover": "Hover colour for hyperlinks",
  "--ui-info": "Semantic colour for informational states",
  "--ui-warning": "Semantic colour for warning states",
  "--ui-success": "Semantic colour for success / positive states",
  "--ui-error": "Semantic colour for error / danger states",
  "--ui-on-error": "Foreground colour used on --ui-error backgrounds",
  "--ui-secondary": "Secondary accent colour (Material 3)",
  "--ui-tertiary": "Tertiary accent colour (Material 3)",
  "--ui-on-tertiary": "Foreground colour used on --ui-tertiary backgrounds",
  "--ui-brand": "Brand colour alias (defaults to --ui-accent)",
  "--ui-focus-ring":
    "Colour used for keyboard focus ring outlines (defaults to --ui-brand)",
  "--ui-icon": "Default icon fill / stroke colour",
  "--ui-indicator": "Active / unread indicator dot colour",

  // ── Surfaces ──
  "--ui-surface": "Primary surface (card, dialog, popover) background",
  "--ui-surface-2": "Secondary surface variant used for nested areas",
  "--ui-surface-variant": "Container variant surface (Material 3)",
  "--ui-surface-card": "Card-specific surface background",
  "--ui-primary-container": "Primary container colour (Material 3)",
  "--ui-on-primary-container":
    "Foreground colour on --ui-primary-container backgrounds",
  "--ui-bg": "Page / app-level background colour",
  "--ui-hover-bg": "Background highlight on hover for interactive elements",
  "--ui-shadow":
    "Default box-shadow used for cards, dialogs, and elevated elements",

  // ── Borders ──
  "--ui-border": "Standard border colour for dividers and outlines",
  "--ui-border-strong": "Emphasised border colour for stronger separations",

  // ── Typography ──
  "--ui-font": "Base font-family for the component tree",
  "--ui-font-body": "Font size for body / table-cell text",
  "--ui-font-header": "Font size for table / section headers",
  "--ui-font-caption": "Font size for captions and small labels",
  "--ui-font-footer": "Font size for footer sections",
  "--ui-font-badge": "Font size for inline badge text",
  "--ui-font-sort-icon": "Font size for sort indicator icons in table headers",
  "--ui-ls-header": "Letter-spacing for table / section headers",
  "--ui-ls-caption": "Letter-spacing for caption text",

  // ── Badge (standalone) ──
  "--ui-badge-bg": "Badge background colour",
  "--ui-badge-text": "Badge foreground text colour",

  // ── Badge (table-row inline variants) ──
  "--ui-badge-neutral-fg": "Neutral badge text colour",
  "--ui-badge-neutral-bg": "Neutral badge background",
  "--ui-badge-neutral-border": "Neutral badge border",
  "--ui-badge-success-fg": "Success badge text colour",
  "--ui-badge-success-bg": "Success badge background",
  "--ui-badge-success-border": "Success badge border",
  "--ui-badge-warning-fg": "Warning badge text colour",
  "--ui-badge-warning-bg": "Warning badge background",
  "--ui-badge-warning-border": "Warning badge border",
  "--ui-badge-danger-fg": "Danger badge text colour",
  "--ui-badge-danger-bg": "Danger badge background",
  "--ui-badge-danger-border": "Danger badge border",
  "--ui-badge-padding": "Internal padding of badge elements",
  "--ui-badge-line-height": "Line-height of badge text",
  "--ui-badge-letter-spacing": "Letter-spacing of badge text",

  // ── Table ──
  "--ui-caption-bg": "Table caption bar background",
  "--ui-caption-text": "Table caption bar text colour",
  "--ui-viewport-height": "Default max height for table scroll viewport",
  "--ui-resize-handle-width": "Width of column resize grab handle",
  "--ui-resize-indicator-width":
    "Width of the visible column resize indicator line",
  "--ui-selection-col-width": "Width of the row selection checkbox column",
  "--ui-row-index-width": "Width of the row-index column",
  "--ui-row-alt": "Alternating (striped) row background",
  "--ui-row-hover": "Row-hover highlight background",
  "--ui-checkbox-size": "Size of table row selection checkboxes",
  "--ui-radio-size": "Size of table row selection radio buttons",
  "--ui-header-bg": "Table header background colour",
  "--ui-cell-height": "Default row / cell height",

  // ── Slider / Progress ──
  "--ui-track": "Slider / progress-bar track background",
  "--ui-thumb": "Slider thumb (handle) colour",
  "--ui-bar-progress": "Progress-bar filled segment colour",
  "--ui-bar-text": "Text colour inside progress-bar",
  "--ui-buffered": "Buffered segment colour on video / progress bar",
  "--ui-loading": "Loading / indeterminate animation track colour",

  // ── Chip ──
  "--ui-chip-bg": "Chip background colour",
  "--ui-chip-text": "Chip text colour",
  "--ui-chip-dismiss": "Chip dismiss (×) icon colour",

  // ── Avatar ──
  "--ui-fallback": "Avatar fallback icon colour when no image is provided",

  // ── Rich-text editor ──
  "--ui-placeholder-bg":
    "Background highlight for placeholder tokens in rich-text editor",
  "--ui-placeholder-text":
    "Text colour for placeholder tokens in rich-text editor",
  "--ui-rtv-border": "Rich-text editor border colour",
  "--ui-rtv-text": "Rich-text editor text colour",

  // ── Density (mode-invariant) ──
  "--ui-density":
    "Numeric density level (0 = default, −1 = compact, 1 = comfortable)",
  "--ui-density-scale":
    "Multiplier derived from density level for spacing calculations",
  "--ui-control-height": "Height of form controls (inputs, buttons, selects)",
  "--ui-gap": "Standard gap between layout elements",
  "--ui-inline-padding": "Horizontal padding inside controls",
  "--ui-block-padding": "Vertical padding inside controls",
  "--ui-radius": "Default border-radius for rounded elements",

  // ── Elevation ──
  "--ui-shadow-sm": "Small elevation shadow",
  "--ui-shadow-md": "Medium elevation shadow",
  "--ui-shadow-lg": "Large elevation shadow",
  "--ui-shadow-xl": "Extra-large elevation shadow",
  "--ui-shadow-dropdown":
    "Shadow for dropdown / overlay elements (menus, popovers)",

  // ── Card ──
  "--ui-card-bg": "Card background colour",
  "--ui-card-text": "Card text colour",
  "--ui-card-border": "Card border colour",
  "--ui-card-shadow": "Card default box-shadow",
  "--ui-card-shadow-hover": "Card box-shadow on hover",
  "--ui-text-card": "Text colour specific to card content areas",

  // ── Button ──
  "--ui-btn-bg": "Button background colour (ghost / outlined variants)",
  "--ui-btn-hover": "Button background on hover",
  "--ui-btn-shadow": "Button box-shadow for elevation",

  // ── Dialog ──
  "--ui-overlay": "Modal dialog backdrop overlay colour",

  // ── Drawer ──
  "--ui-drawer-bg": "Drawer panel background",
  "--ui-drawer-text": "Drawer text colour",
  "--ui-drawer-border": "Drawer border colour",
  "--ui-drawer-shadow": "Drawer box-shadow",
  "--ui-drawer-backdrop": "Drawer backdrop overlay colour",

  // ── Dropdown ──
  "--ui-dropdown-bg": "Dropdown list-box background",
  "--ui-dropdown-text": "Dropdown text colour",
  "--ui-dropdown-border": "Dropdown border colour",
  "--ui-dropdown-shadow": "Dropdown box-shadow",
  "--ui-dropdown-placeholder": "Dropdown placeholder text colour",

  // ── Toast ──
  "--ui-toast-bg": "Toast notification background",
  "--ui-toast-text": "Toast text colour",
  "--ui-toast-border": "Toast border colour",
  "--ui-toast-shadow": "Toast box-shadow",

  // ── Calendar ──
  "--ui-cal-bg": "Calendar background",
  "--ui-cal-text": "Calendar text colour",
  "--ui-cal-text-muted": "Calendar muted / inactive day text",
  "--ui-cal-border": "Calendar border colour",
  "--ui-cal-hover-bg": "Calendar day cell hover background",
  "--ui-cal-selected-bg": "Calendar selected day background",
  "--ui-cal-selected-text": "Calendar selected day text colour",
  "--ui-cal-today-bg": "Calendar today indicator background",
  "--ui-cal-today-text": "Calendar today indicator text colour",
  "--ui-cal-nav-hover": "Calendar navigation arrow hover background",
  "--ui-cal-popover-border": "Calendar popover border colour",
  "--ui-cal-popover-hover": "Calendar popover item hover background",
  "--ui-cal-popover-text": "Calendar popover text colour",
  "--ui-cal-popover-text-muted": "Calendar popover muted text colour",
  "--ui-event-text": "Calendar event label text colour",

  // ── Timeline ──
  "--ui-timeline-dot-size": "Size of the timeline node dot",
  "--ui-timeline-connector-width": "Thickness of the connector line",
  "--ui-timeline-gap": "Vertical spacing between timeline nodes",
  "--ui-timeline-content-gap":
    "Horizontal gap between dot/connector and content",

  // ── Map View ──
  "--mv-surface": "Map view surface / overlay background",
  "--mv-text": "Map view text colour",
  "--mv-muted": "Map view muted text",
  "--mv-border": "Map view border colour",
  "--mv-shadow": "Map view popup / panel shadow",
  "--mv-highlight": "Map view highlighted / selected item colour",
  "--mv-attr-bg": "Map attribution bar background",
  "--mv-attr-text": "Map attribution text colour",
  "--mv-font": "Map view font family",

  // ── Chart ──
  "--ui-chart-bg": "Chart area background",
  "--ui-chart-text": "Chart axis / label text colour",
  "--ui-chart-grid": "Chart grid line colour",
  "--ui-chart-legend-text": "Chart legend label text colour",
  "--ui-chart-legend-value": "Chart legend value text colour",

  // ── Gauge ──
  "--ui-gauge-face": "Gauge face ring colour",
  "--ui-gauge-needle": "Gauge needle colour",
  "--ui-gauge-tick": "Gauge minor tick colour",
  "--ui-gauge-text": "Gauge readout text colour",

  // ── Gantt ──
  "--ui-gantt-bg": "Gantt chart background",
  "--ui-gantt-text": "Gantt chart text colour",
  "--ui-gantt-text-muted": "Gantt chart muted text",
  "--ui-gantt-border": "Gantt chart grid line colour",
  "--ui-gantt-today": "Gantt chart today indicator colour",
  "--ui-milestone-bg": "Gantt milestone marker background",

  // ── Clock ──
  "--ui-clock-bg": "Clock face background",
  "--ui-clock-rim": "Clock face rim / border",
  "--ui-clock-text": "Clock numeral text colour",
  "--ui-clock-tick": "Clock minor tick mark colour",
  "--ui-clock-tick-hour": "Clock major (hour) tick mark colour",
  "--ui-clock-center": "Clock center dot colour",
  "--ui-clock-hand-hour": "Clock hour hand colour",
  "--ui-clock-hand-minute": "Clock minute hand colour",
  "--ui-clock-hand-second": "Clock second hand colour",

  // ── Image ──
  "--ui-image-border-radius": "Border radius for image component",
  "--ui-image-placeholder-bg": "Image placeholder / shimmer background",
  "--ui-image-placeholder-shimmer": "Image loading shimmer highlight colour",

  // ── Toggle ──
  "--ui-toggle-track-bg": "Toggle switch track background (off state)",
  "--ui-toggle-thumb-bg": "Toggle switch thumb colour",
  "--ui-toggle-thumb-shadow": "Toggle thumb drop-shadow",
  "--ui-toggle-focus-ring": "Toggle focus ring colour",
  "--ui-toggle-label-color": "Toggle label text colour",

  // ── Upload ──
  "--ui-upload-border-style": "Upload dropzone border style (dashed / solid)",

  // ── Sidebar ──
  "--ui-sidebar-bg": "Sidebar / nav-rail background",
  "--ui-sidebar-text": "Sidebar text colour",
  "--ui-sidebar-border": "Sidebar divider border",
  "--ui-sidebar-width": "Default sidebar width",
  "--ui-sidebar-hover": "Sidebar item hover background",
  "--ui-sidebar-active-bg": "Sidebar active / selected item background",
  "--ui-sidebar-muted": "Sidebar muted text colour",
  "--ui-sidebar-badge-bg": "Sidebar notification badge background",
  "--ui-sidebar-badge-text": "Sidebar notification badge text colour",

  // ── Tree View ──
  "--ui-tree-surface": "Tree view surface background",
  "--ui-tree-text": "Tree view text colour",
  "--ui-tree-border": "Tree view indent guide / border colour",

  // ── Divider (resizable panels) ──
  "--ui-divider-bg": "Resizable divider background colour",
  "--ui-divider-bg-hover": "Resizable divider hover background",
  "--ui-divider-handle": "Divider grab handle colour",
  "--ui-divider-handle-hover": "Divider grab handle hover colour",
  "--ui-divider-width": "Divider strip width",

  // ── Color Picker ──
  "--ui-cp-border": "Colour picker panel border",
  "--ui-cp-surface": "Colour picker surface background",
  "--ui-cp-text": "Colour picker text colour",
  "--ui-cp-hover-bg": "Colour picker swatch hover background",

  // ── Video Player ──
  "--ui-video-controls-bg": "Video player controls bar background",
  "--ui-video-controls-text": "Video player controls text colour",

  // ── Navigation Page ──
  "--ui-content-bg": "Main content area background",
  "--ui-breadcrumb-bg": "Breadcrumb bar background",
  "--ui-breadcrumb-border": "Breadcrumb bar bottom border",

  // ── Dashboard ──
  "--ui-dashboard-bg": "Dashboard root background",
  "--ui-dashboard-text": "Dashboard text colour",
  "--ui-dock-bg": "Dashboard dock / toolbar background",
  "--ui-dock-chip-bg": "Dashboard dock chip background",
  "--ui-dock-chip-text": "Dashboard dock chip text colour",
  "--ui-dock-chip-border": "Dashboard dock chip border",
  "--ui-dock-chip-hover-bg": "Dashboard dock chip hover background",
  "--ui-dock-chip-shadow": "Dashboard dock chip shadow",
  "--ui-dock-notify-glow":
    "Dashboard dock notification glow colour (derived from --ui-secondary)",

  // ── Dashboard Panel ──
  "--ui-panel-bg": "Dashboard panel background",
  "--ui-panel-text": "Dashboard panel text colour",
  "--ui-panel-text-muted": "Dashboard panel muted text",
  "--ui-panel-border": "Dashboard panel border",
  "--ui-panel-header-bg": "Dashboard panel header background",
  "--ui-panel-radius": "Dashboard panel border-radius",
  "--ui-panel-shadow": "Dashboard panel box-shadow",
  "--ui-panel-action-hover": "Dashboard panel action button hover background",
  "--ui-panel-notify-glow": "Dashboard panel notification glow colour",

  // ── Filter ──
  "--ui-filter-bg": "Filter bar / chip area background",

  // ── Chat View ──
  "--cv-bg": "Chat view background",
  "--cv-text": "Chat view text colour",
  "--cv-border": "Chat view border colour",
  "--cv-divider-text": "Chat date-divider text colour",
  "--cv-bubble-mine": "Current user's chat bubble background",
  "--cv-bubble-mine-text": "Current user's chat bubble text colour",
  "--cv-bubble-other": "Other participant's chat bubble background",
  "--cv-bubble-other-text": "Other participant's chat bubble text colour",
  "--cv-system-text": "System message text colour",
  "--cv-sender-name": "Sender name label colour",
  "--cv-timestamp": "Message timestamp colour",
  "--cv-composer-bg": "Message composer input background",
  "--cv-composer-border": "Message composer border colour",
  "--cv-send-bg": "Send button background",
  "--cv-send-text": "Send button text / icon colour",
  "--cv-send-disabled": "Send button colour when disabled",
  "--cv-empty-text": "Empty-state placeholder text colour",

  // ── Wizard ──
  "--wz-bg": "Wizard container background",
  "--wz-text": "Wizard text colour",
  "--wz-border": "Wizard border colour",
  "--wz-indicator-bg": "Step indicator default (inactive) background",
  "--wz-indicator-text": "Step indicator default text colour",
  "--wz-indicator-active-bg": "Step indicator active-step background",
  "--wz-indicator-active-text": "Step indicator active-step text colour",
  "--wz-indicator-completed-bg": "Step indicator completed-step background",
  "--wz-indicator-completed-text": "Step indicator completed-step text colour",
  "--wz-connector": "Step connector line colour (default)",
  "--wz-connector-completed": "Step connector line colour (completed segment)",
  "--wz-step-label": "Step label text colour",
  "--wz-step-optional": "Optional step hint text colour",
  "--wz-nav-bg": "Wizard navigation bar background",
  "--wz-btn-primary-bg": "Wizard primary button background",
  "--wz-btn-primary-text": "Wizard primary button text colour",
  "--wz-btn-secondary-bg": "Wizard secondary button background",
  "--wz-btn-secondary-text": "Wizard secondary button text colour",
  "--wz-btn-secondary-border": "Wizard secondary button border colour",
  "--wz-btn-disabled": "Wizard disabled button colour",

  // ── Command Palette ──
  "--cp-backdrop": "Command palette backdrop overlay",
  "--cp-bg": "Command palette panel background",
  "--cp-text": "Command palette text colour",
  "--cp-border": "Command palette border colour",
  "--cp-shadow": "Command palette box-shadow",
  "--cp-search-bg": "Command palette search input background",
  "--cp-surface": "Command palette surface colour",
  "--cp-text-muted": "Command palette muted text colour",
  "--cp-item-hover": "Command palette item hover background",
  "--cp-item-active-text": "Command palette active item text colour",
  "--cp-accent-hover": "Command palette accent hover colour",
  "--cp-kbd-bg": "Keyboard shortcut badge background",
  "--cp-kbd-text": "Keyboard shortcut badge text colour",
  "--cp-kbd-border": "Keyboard shortcut badge border",
  "--cp-group-text": "Command palette group heading text colour",
  "--cp-empty-text": "Command palette empty-results text colour",
  "--cp-disabled-opacity": "Opacity for disabled command palette items",

  // ── Kanban Board ──
  "--kb-surface": "Kanban board surface background",
  "--kb-text": "Kanban board text colour",
  "--kb-text-secondary": "Kanban board secondary text colour",
  "--kb-border": "Kanban board border colour",
  "--kb-card-surface": "Kanban card background",
  "--kb-card-radius": "Kanban card border-radius",
  "--kb-card-gap": "Gap between kanban cards",
  "--kb-column-width": "Kanban column fixed width",
  "--kb-column-gap": "Gap between kanban columns",
  "--kb-column-radius": "Kanban column border-radius",

  // ── File Browser ──
  "--fb-bg": "File browser background",
  "--fb-text": "File browser text colour",
  "--fb-text-secondary": "File browser secondary text colour",
  "--fb-border": "File browser border colour",
  "--fb-header-bg": "File browser header bar background",
  "--fb-sidebar-bg": "File browser sidebar background",
  "--fb-sidebar-width": "File browser sidebar width",
  "--fb-details-width": "File browser details pane width",
  "--fb-entry-hover": "File entry hover background",
  "--fb-entry-selected-text": "Selected file entry text colour",
  "--fb-empty-text": "File browser empty-state text colour",
  "--fb-column-width": "Column-view column width",
  "--fb-divider-bg": "File browser resize divider background",
  "--fb-divider-bg-hover": "File browser resize divider hover background",
  "--fb-divider-handle": "File browser resize handle colour",
  "--fb-divider-handle-hover": "File browser resize handle hover colour",

  // ── Property Sheet ──
  "--ui-group-bg": "Property sheet group header background",

  // ── Additional tokens (auto-discovered) ──
  "--ui-divider-bg-active": "Resizable divider background while actively dragging",
  "--ui-dock-notify-accent": "Dashboard dock notification accent colour",
  "--ui-gauge-accent": "Gauge accent / active segment colour",
  "--ui-indicator-active": "Active state indicator colour",
  "--ui-panel-notify-accent": "Dashboard panel notification accent colour",
  "--ui-rtv-link": "Rich-text editor link text colour",
  "--ui-selected-bg": "Selected row background (derived from accent)",
  "--ui-selected-hover-bg": "Selected row hover background (derived from accent)",
  "--ui-sidebar-accent": "Sidebar active / accent highlight colour",
  "--ui-timeline-connector-color": "Timeline connector line colour",
  "--ui-timeline-dot-border": "Timeline dot border colour",
  "--ui-timeline-dot-color": "Timeline dot fill colour",
  "--ui-timeline-surface": "Timeline surface background",
  "--ui-timeline-text": "Timeline text colour",
  "--ui-toast-icon-error": "Toast error icon colour",
  "--ui-toast-icon-info": "Toast info icon colour",
  "--ui-toast-icon-success": "Toast success icon colour",
  "--ui-toast-icon-warning": "Toast warning icon colour",
  "--ui-toggle-text-color": "Toggle switch label text colour",
  "--ui-toggle-track-bg-on": "Toggle switch track background (on state)",
  "--ui-tree-accent": "Tree view accent / selected item colour",
  "--cp-accent": "Command palette accent colour",
  "--cp-item-active": "Command palette active (keyboard-focused) item background",
  "--fb-divider-bg-active": "File browser resize divider background while dragging",
  "--fb-entry-selected": "File browser selected entry background",
  "--kb-accent": "Kanban board accent colour",
  "--mv-accent": "Map view accent / highlight colour",
  "--slider-thumb": "Colour picker slider thumb colour",
  "--slider-thumb-border": "Colour picker slider thumb border colour",
  "--swatch-ring": "Colour picker swatch selection ring colour",
};

// ── Parse a single file ────────────────────────────────────────────

const DEF_RE = /^\s*(--[a-z][a-z0-9_-]*)\s*:\s*(.+?)\s*;?\s*$/;

function parseFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const ownerInfo = resolveOwner(filePath);
  const rel = relative(ROOT, filePath);
  const results = [];

  let inDarkBlock = false;
  let darkBraceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track dark-mode context via mixin names, class names, and media queries
    if (
      !inDarkBlock &&
      /dark-mode|dark-theme|prefers-color-scheme:\s*dark|ui-tokens-dark/.test(
        line,
      )
    ) {
      inDarkBlock = true;
      darkBraceDepth = 0;
      // Count opening braces on this line
      for (const ch of line) {
        if (ch === "{") darkBraceDepth++;
        if (ch === "}") darkBraceDepth--;
      }
      continue;
    }

    if (inDarkBlock) {
      for (const ch of line) {
        if (ch === "{") darkBraceDepth++;
        if (ch === "}") darkBraceDepth--;
      }
      if (darkBraceDepth <= 0) {
        inDarkBlock = false;
      }
    }

    const match = line.match(DEF_RE);
    if (match) {
      const [, name, rawValue] = match;
      // Skip SCSS variables ($ prefix) accidentally caught
      if (name.startsWith("--") === false) continue;
      // Skip #{} wrappers
      const value = rawValue.replace(/^#\{(.*)\}$/, "$1").trim();

      results.push({
        name,
        value,
        type: inferType(value),
        mode: inDarkBlock ? "dark" : "light",
        file: rel,
        line: i + 1,
        owner: ownerInfo.owner,
        package: ownerInfo.pkg,
      });
    }
  }

  return results;
}

// ── Main ───────────────────────────────────────────────────────────

const scssFiles = walk(PACKAGES_DIR, [".scss"]);
const tsFiles = walk(PACKAGES_DIR, [".ts"]).filter(
  (f) => !f.includes(".spec.") && !f.includes(".stories."),
);

// Process _tokens.scss FIRST so its values win for globals
const tokenFiles = scssFiles.filter((f) => f.includes("_tokens.scss"));
const otherScss = scssFiles.filter((f) => !f.includes("_tokens.scss"));
const files = [...tokenFiles, ...otherScss, ...tsFiles];

const allDefs = [];
for (const f of files) {
  allDefs.push(...parseFile(f));
}

// Deduplicate into a map keyed by variable name
const tokenMap = new Map();

for (const def of allDefs) {
  if (!tokenMap.has(def.name)) {
    tokenMap.set(def.name, {
      name: def.name,
      description: DESCRIPTIONS[def.name] || "",
      type: def.type,
      scope: def.name.startsWith("--ui-")
        ? "global"
        : "component",
      namespace: def.name.match(/^--([a-z]+)-/)?.[1] || "ui",
      values: { light: null, dark: null },
      definitions: [],
    });
  }

  const entry = tokenMap.get(def.name);

  // Record light/dark values (prefer _tokens.scss for globals)
  if (def.mode === "light" && !entry.values.light) {
    entry.values.light = def.value;
  } else if (def.mode === "dark" && !entry.values.dark) {
    entry.values.dark = def.value;
  }

  // Track all definition sites (but skip duplicate dark/light at same file)
  const existing = entry.definitions.find(
    (d) => d.file === def.file && d.mode === def.mode,
  );
  if (!existing) {
    entry.definitions.push({
      file: def.file,
      line: def.line,
      owner: def.owner,
      package: def.package,
      mode: def.mode,
    });
  }
}

// Sort entries: globals first, then by namespace, then alphabetically
const sorted = [...tokenMap.values()].sort((a, b) => {
  if (a.scope !== b.scope) return a.scope === "global" ? -1 : 1;
  if (a.namespace !== b.namespace)
    return a.namespace.localeCompare(b.namespace);
  return a.name.localeCompare(b.name);
});

const manifest = {
  $schema: "css-token-manifest-schema",
  generated: new Date().toISOString(),
  description:
    "Complete manifest of all CSS custom properties in the @theredhead UI library. " +
    "Used by the Theme Studio to expose tweakable design tokens to developers.",
  tokenCount: sorted.length,
  namespaces: {
    ui: "Global design tokens (defined in @theredhead/lucid-theme, consumed everywhere)",
    cv: "Chat view component tokens (UIChatView)",
    cp: "Command palette component tokens (UICommandPalette)",
    wz: "Wizard component tokens (UIWizard)",
    kb: "Kanban board component tokens (UIKanbanBoard)",
    fb: "File browser component tokens (UIFileBrowser)",
    mv: "Map view component tokens (UIMapView)",
  },
  tokens: sorted,
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

console.log(`✅  Wrote ${sorted.length} tokens to css-token-manifest.json`);
