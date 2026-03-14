/** A geographic coordinate. */
export interface MapLatLng {
  lat: number;
  lng: number;
}

/**
 * A marker placed on the map at a geographic position.
 */
export interface MapMarker {
  /** Geographic position. */
  position: MapLatLng;

  /**
   * Custom SVG string for the marker icon.
   * When omitted a default pin shape is rendered.
   */
  icon?: string;

  /** Tooltip text and accessible label. */
  label?: string;

  /**
   * Fill colour for the default pin.
   * Ignored when a custom {@link icon} is provided.
   * Defaults to `var(--mv-accent)`.
   */
  color?: string;

  /**
   * Anchor offset from the top-left of the icon in pixels `[x, y]`.
   * Defaults to centre-bottom of the default pin.
   */
  anchor?: [number, number];

  /**
   * Icon dimensions in pixels `[width, height]`.
   * Defaults to `[24, 36]`.
   */
  size?: [number, number];
}

/**
 * A polyline rendered as an SVG path on the map.
 */
export interface MapPolyline {
  /** Ordered list of geographic vertices. */
  points: MapLatLng[];

  /** Stroke colour. Defaults to `var(--mv-accent)`. */
  color?: string;

  /** Stroke width in pixels. Defaults to `2`. */
  width?: number;

  /** When `true` the highlight colours / widths are used instead. */
  highlighted?: boolean;

  /** Stroke colour when highlighted. Defaults to `var(--mv-highlight)`. */
  highlightColor?: string;

  /** Stroke width when highlighted. Defaults to `4`. */
  highlightWidth?: number;

  /** SVG dash pattern (e.g. `"8 4"`). Solid if omitted. */
  dashArray?: string;
}

/**
 * A closed polygon rendered as an SVG path on the map.
 */
export interface MapPolygon {
  /** Ordered list of geographic vertices. The path is closed automatically. */
  points: MapLatLng[];

  /** Fill colour. Defaults to `var(--mv-accent)`. */
  fillColor?: string;

  /** Fill opacity (`0`–`1`). Defaults to `0.2`. */
  fillOpacity?: number;

  /** Stroke colour. Defaults to `var(--mv-accent)`. */
  strokeColor?: string;

  /** Stroke width in pixels. Defaults to `2`. */
  strokeWidth?: number;

  /** When `true` the highlight colours / widths / opacity are used. */
  highlighted?: boolean;

  /** Fill colour when highlighted. */
  highlightFillColor?: string;

  /** Fill opacity when highlighted. Defaults to `0.4`. */
  highlightFillOpacity?: number;

  /** Stroke colour when highlighted. */
  highlightStrokeColor?: string;

  /** Stroke width when highlighted. Defaults to `3`. */
  highlightStrokeWidth?: number;
}

/** Default OpenStreetMap tile URL template. */
export const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/**
 * Default OSM attribution.
 * Required by the OpenStreetMap tile usage policy.
 */
export const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

/** Default marker dimensions `[width, height]` in pixels. */
export const DEFAULT_MARKER_SIZE: [number, number] = [24, 36];
