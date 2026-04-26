// ── Component config schemas ────────────────────────────────────────

/**
 * Describes a single config property that the property inspector
 * renders as a structured form control.
 */
export interface ConfigPropertySchema {

  /** The config key name (e.g. `"type"`, `"multiline"`). */
  readonly key: string;

  /** Human-readable label shown in the inspector. */
  readonly label: string;

  /** The editor to use. */
  readonly editor: "text" | "number" | "boolean" | "select" | "richtext";

  /**
   * For `"select"` editors — the list of allowed values.
   * Each entry is either a plain string (used as both label and value)
   * or a `{ label, value }` pair.
   */
  readonly options?: readonly (string | { label: string; value: string })[];

  /** Default value when the property is not set. */
  readonly defaultValue?: unknown;

  /** Optional short hint shown as placeholder text. */
  readonly placeholder?: string;

  /**
   * When provided, the property is only shown in the inspector if this
   * predicate returns `true` for the current config values.
   */
  readonly visibleWhen?: (config: Record<string, unknown>) => boolean;
}

/**
 * Map from component key (e.g. `"text"`, `"slider"`) to an ordered
 * list of config property schemas.
 *
 * Properties that are not in this map for a given component are
 * still stored in `config` but are only editable via the raw
 * JSON fallback textarea.
 */
export const COMPONENT_CONFIG_SCHEMAS: Readonly<
  Record<string, readonly ConfigPropertySchema[]>
> = {
  text: [
    {
      key: "type",
      label: "Input type",
      editor: "select",
      options: ["text", "email", "password", "url", "tel", "search"],
      defaultValue: "text",
      visibleWhen: (cfg) => !cfg["textAdapter"],
    },
    {
      key: "textAdapter",
      label: "Text adapter",
      editor: "select",
      options: [
        { label: "(none)", value: "" },
        { label: "Email", value: "email" },
        { label: "URL", value: "url" },
        { label: "IP Address", value: "ip" },
        { label: "Phone", value: "phone" },
        { label: "Credit Card", value: "creditCard" },
        { label: "Money", value: "money" },
        { label: "Integer", value: "integer" },
        { label: "Float", value: "float" },
        { label: "Decimal", value: "decimal" },
        { label: "Hexadecimal", value: "hexadecimal" },
        { label: "Percentage", value: "percentage" },
        { label: "Date", value: "date" },
        { label: "Time", value: "time" },
        { label: "Colour", value: "color" },
        { label: "Slug", value: "slug" },
        { label: "UUID", value: "uuid" },
        { label: "Cron", value: "cron" },
      ],
      defaultValue: "",
    },
    {
      key: "placeholder",
      label: "Placeholder",
      editor: "text",
      placeholder: "e.g. Enter your name…",
    },
    {
      key: "multiline",
      label: "Multiline (textarea)",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "rows",
      label: "Visible rows",
      editor: "number",
      defaultValue: 3,
      placeholder: "3",
    },
  ],

  select: [
    {
      key: "placeholder",
      label: "Placeholder",
      editor: "text",
      placeholder: "e.g. Choose…",
    },
  ],

  checkbox: [
    {
      key: "variant",
      label: "Variant",
      editor: "select",
      options: ["checkbox", "switch"],
      defaultValue: "checkbox",
    },
    {
      key: "indeterminate",
      label: "Indeterminate",
      editor: "boolean",
      defaultValue: false,
    },
  ],

  toggle: [
    {
      key: "onLabel",
      label: "On label",
      editor: "text",
      placeholder: "e.g. Enabled",
    },
    {
      key: "offLabel",
      label: "Off label",
      editor: "text",
      placeholder: "e.g. Disabled",
    },
    {
      key: "size",
      label: "Size",
      editor: "select",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
  ],

  radio: [],

  autocomplete: [
    {
      key: "placeholder",
      label: "Placeholder",
      editor: "text",
      placeholder: "e.g. Search…",
    },
    {
      key: "minQueryLength",
      label: "Min query length",
      editor: "number",
      defaultValue: 1,
    },
    {
      key: "multi",
      label: "Multi-select",
      editor: "boolean",
      defaultValue: false,
    },
  ],

  date: [
    {
      key: "format",
      label: "Date format",
      editor: "select",
      options: [
        "yyyy-MM-dd",
        "dd/MM/yyyy",
        "MM/dd/yyyy",
        "dd.MM.yyyy",
        "dd-MM-yyyy",
        "yyyy/MM/dd",
      ],
      defaultValue: "yyyy-MM-dd",
    },
    {
      key: "placeholder",
      label: "Placeholder",
      editor: "text",
      placeholder: "e.g. Select date",
    },
    {
      key: "firstDayOfWeek",
      label: "First day of week",
      editor: "select",
      options: [
        { label: "Sunday", value: "0" },
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
      ],
      defaultValue: 1,
    },
  ],

  time: [
    {
      key: "clockMode",
      label: "Clock mode",
      editor: "select",
      options: [
        { label: "24-hour", value: "24" },
        { label: "12-hour", value: "12" },
      ],
      defaultValue: 24,
    },
    {
      key: "minuteStep",
      label: "Minute step",
      editor: "number",
      defaultValue: 1,
    },
  ],

  datetime: [
    {
      key: "dateFormat",
      label: "Date format",
      editor: "select",
      options: [
        "yyyy-MM-dd",
        "dd/MM/yyyy",
        "MM/dd/yyyy",
        "dd.MM.yyyy",
        "dd-MM-yyyy",
        "yyyy/MM/dd",
      ],
      defaultValue: "yyyy-MM-dd",
    },
    {
      key: "clockMode",
      label: "Clock mode",
      editor: "select",
      options: [
        { label: "24-hour", value: "24" },
        { label: "12-hour", value: "12" },
      ],
      defaultValue: 24,
    },
    {
      key: "minuteStep",
      label: "Minute step",
      editor: "number",
      defaultValue: 1,
    },
  ],

  color: [
    {
      key: "defaultMode",
      label: "Default mode",
      editor: "select",
      options: ["theme", "grid", "rgba", "hsla"],
      defaultValue: "theme",
    },
  ],

  slider: [
    {
      key: "mode",
      label: "Mode",
      editor: "select",
      options: ["single", "range"],
      defaultValue: "single",
    },
    {
      key: "min",
      label: "Min value",
      editor: "number",
      defaultValue: 0,
    },
    {
      key: "max",
      label: "Max value",
      editor: "number",
      defaultValue: 100,
    },
    {
      key: "step",
      label: "Step",
      editor: "number",
      defaultValue: 1,
    },
    {
      key: "showValue",
      label: "Show value label",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "showTicks",
      label: "Show tick marks",
      editor: "boolean",
      defaultValue: false,
    },
  ],

  richtext: [
    {
      key: "mode",
      label: "Mode",
      editor: "select",
      options: ["html", "markdown"],
      defaultValue: "html",
    },
    {
      key: "placeholder",
      label: "Placeholder",
      editor: "text",
      placeholder: "e.g. Type here…",
    },
    {
      key: "sanitize",
      label: "Sanitize HTML",
      editor: "boolean",
      defaultValue: true,
    },
    {
      key: "maxLength",
      label: "Max length",
      editor: "number",
      placeholder: "0 = unlimited",
    },
  ],

  file: [
    {
      key: "accept",
      label: "Accepted types",
      editor: "text",
      placeholder: "e.g. image/*,.pdf",
    },
    {
      key: "multiple",
      label: "Multiple files",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "maxFileSize",
      label: "Max file size (bytes)",
      editor: "number",
      placeholder: "e.g. 5242880",
    },
  ],

  signature: [
    {
      key: "allowDraw",
      label: "Allow draw",
      editor: "boolean",
      defaultValue: true,
    },
    {
      key: "allowPaste",
      label: "Allow paste",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "allowDrop",
      label: "Allow drop",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "allowBrowse",
      label: "Allow browse",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "pressureEnabled",
      label: "Pressure-sensitive",
      editor: "boolean",
      defaultValue: false,
    },
    {
      key: "strokeColor",
      label: "Stroke colour",
      editor: "text",
      placeholder: "e.g. #1d232b",
      defaultValue: "#1d232b",
    },
    {
      key: "minStrokeWidth",
      label: "Min stroke width (px)",
      editor: "number",
      defaultValue: 1.5,
    },
    {
      key: "maxStrokeWidth",
      label: "Max stroke width (px)",
      editor: "number",
      defaultValue: 3.5,
    },
  ],

  // ── Flair components ────────────────────────────────────────────────

  "flair:richtext": [
    {
      key: "content",
      label: "HTML content",
      editor: "richtext",
    },
  ],

  "flair:image": [
    {
      key: "src",
      label: "Image URL",
      editor: "text",
      placeholder: "https://example.com/image.png",
    },
    {
      key: "alt",
      label: "Alt text",
      editor: "text",
      placeholder: "Describe the image",
    },
    {
      key: "width",
      label: "Width (px)",
      editor: "number",
      placeholder: "e.g. 400",
    },
    {
      key: "height",
      label: "Height (px)",
      editor: "number",
      placeholder: "e.g. 300",
    },
  ],

  "flair:media": [
    {
      key: "source",
      label: "Media URL",
      editor: "text",
      placeholder: "https://example.com/video.mp4",
    },
    {
      key: "type",
      label: "Media type",
      editor: "select",
      options: ["video", "audio"],
      defaultValue: "video",
    },
    {
      key: "controls",
      label: "Show controls",
      editor: "boolean",
      defaultValue: true,
    },
    {
      key: "poster",
      label: "Poster image URL",
      editor: "text",
      placeholder: "https://example.com/poster.jpg",
    },
  ],
};

/**
 * Returns the config property schemas for a given component key.
 * Returns an empty array for unknown components.
 */
export function getConfigSchema(
  component: string,
): readonly ConfigPropertySchema[] {
  return COMPONENT_CONFIG_SCHEMAS[component] ?? [];
}
