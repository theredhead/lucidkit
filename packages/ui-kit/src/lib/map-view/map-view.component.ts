import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core";

import {
  DEFAULT_ATTRIBUTION,
  DEFAULT_MARKER_SIZE,
  DEFAULT_TILE_URL,
  type MapLatLng,
  type MapMarker,
  type MapPolygon,
  type MapPolyline,
} from "./map-view.model";
import {
  computeTiles,
  latLngToViewport,
  pointsToPolygonPath,
  pointsToPolylinePath,
  type TileDescriptor,
} from "./map-view.utils";
import { UISurface } from '@theredhead/lucid-foundation';

// ── Internal rendered-element types ─────────────────────────────────

/** @internal */
interface RenderedPolyline {
  path: string;
  stroke: string;
  strokeWidth: number;
  dashArray: string | null;
}

/** @internal */
interface RenderedPolygon {
  path: string;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
}

/** @internal */
interface RenderedMarker {
  left: number;
  top: number;
  width: number;
  height: number;
  isCustom: boolean;

  /** Data-URI for custom icons. */
  dataUri: string;

  /** Inline colour for default pin (empty → CSS default). */
  color: string;
  label: string | undefined;
}

/**
 * Static map snapshot component.
 *
 * Renders a tile grid centred on a geographic coordinate at a fixed
 * zoom level, with SVG overlays for polylines and polygons and
 * absolutely-positioned marker pins.
 *
 * No panning, zooming, or interaction — purely visual display.
 * Zero external dependencies beyond Angular itself.
 *
 * @example
 * ```html
 * <ui-map-view
 *   [center]="{ lat: 52.37, lng: 4.90 }"
 *   [zoom]="13"
 *   [markers]="markers"
 * />
 * ```
 */
@Component({
  selector: "ui-map-view",
  standalone: true,
  templateUrl: "./map-view.component.html",
  styleUrl: "./map-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-map-view",
    "[style.width]": "width()",
    "[style.height]": "height()",
  },
})
export class UIMapView implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  // ── Inputs ──────────────────────────────────────────────────────────

  /** Geographic centre of the map. */
  readonly center = input.required<MapLatLng>();

  /** Zoom level (`0`–`19`). */
  readonly zoom = input.required<number>();

  /**
   * Tile URL template with `{x}`, `{y}`, `{z}` placeholders.
   * Defaults to OpenStreetMap.
   */
  readonly tileUrl = input(DEFAULT_TILE_URL);

  /** CSS width of the component. Defaults to `'100%'`. */
  readonly width = input("100%");

  /** CSS height of the component. Defaults to `'400px'`. */
  readonly height = input("400px");

  /** Tile attribution HTML. Defaults to the OSM attribution. */
  readonly attribution = input(DEFAULT_ATTRIBUTION);

  /** Accessible label for the map region. */
  readonly ariaLabel = input("Map");

  /** Markers to render. */
  readonly markers = input<MapMarker[]>([]);

  /** Polylines to render. */
  readonly polylines = input<MapPolyline[]>([]);

  /** Polygons to render. */
  readonly polygons = input<MapPolygon[]>([]);

  /**
   * Apply a CSS filter to invert tile colours in dark mode.
   * Defaults to `true`. Set to `false` when using a dark tile
   * provider URL.
   */
  readonly darkModeTiles = input(true);

  // ── Internal state ──────────────────────────────────────────────────

  /** Measured pixel dimensions of the host element. */
  protected readonly containerSize = signal({ width: 0, height: 0 });

  // ── Computed: tiles ─────────────────────────────────────────────────

  protected readonly tiles = computed<TileDescriptor[]>(() => {
    const { width, height } = this.containerSize();
    const c = this.center();
    const z = this.zoom();
    return computeTiles(c.lat, c.lng, z, width, height, this.tileUrl());
  });

  // ── Computed: polylines ─────────────────────────────────────────────

  protected readonly renderedPolylines = computed<RenderedPolyline[]>(() => {
    const { width, height } = this.containerSize();
    if (width === 0 || height === 0) return [];
    const c = this.center();
    const z = this.zoom();

    return this.polylines().map((pl) => {
      const hl = pl.highlighted ?? false;
      const points = pl.points.map((p) =>
        latLngToViewport(p.lat, p.lng, z, c.lat, c.lng, width, height),
      );
      return {
        path: pointsToPolylinePath(points),
        stroke: hl
          ? (pl.highlightColor ?? "var(--mv-highlight)")
          : (pl.color ?? "var(--mv-accent)"),
        strokeWidth: hl ? (pl.highlightWidth ?? 4) : (pl.width ?? 2),
        dashArray: pl.dashArray ?? null,
      };
    });
  });

  // ── Computed: polygons ──────────────────────────────────────────────

  protected readonly renderedPolygons = computed<RenderedPolygon[]>(() => {
    const { width, height } = this.containerSize();
    if (width === 0 || height === 0) return [];
    const c = this.center();
    const z = this.zoom();

    return this.polygons().map((pg) => {
      const hl = pg.highlighted ?? false;
      const points = pg.points.map((p) =>
        latLngToViewport(p.lat, p.lng, z, c.lat, c.lng, width, height),
      );
      return {
        path: pointsToPolygonPath(points),
        fill: hl
          ? (pg.highlightFillColor ?? pg.fillColor ?? "var(--mv-accent)")
          : (pg.fillColor ?? "var(--mv-accent)"),
        fillOpacity: hl
          ? (pg.highlightFillOpacity ?? 0.4)
          : (pg.fillOpacity ?? 0.2),
        stroke: hl
          ? (pg.highlightStrokeColor ?? pg.strokeColor ?? "var(--mv-accent)")
          : (pg.strokeColor ?? "var(--mv-accent)"),
        strokeWidth: hl
          ? (pg.highlightStrokeWidth ?? 3)
          : (pg.strokeWidth ?? 2),
      };
    });
  });

  // ── Computed: markers ───────────────────────────────────────────────

  protected readonly renderedMarkers = computed<RenderedMarker[]>(() => {
    const { width, height } = this.containerSize();
    if (width === 0 || height === 0) return [];
    const c = this.center();
    const z = this.zoom();

    return this.markers().map((m) => {
      const [w, h] = m.size ?? DEFAULT_MARKER_SIZE;
      const [ax, ay] = m.anchor ?? [w / 2, h]; // default: centre-bottom
      const vp = latLngToViewport(
        m.position.lat,
        m.position.lng,
        z,
        c.lat,
        c.lng,
        width,
        height,
      );
      const isCustom = !!m.icon;
      return {
        left: vp.x - ax,
        top: vp.y - ay,
        width: w,
        height: h,
        isCustom,
        dataUri: isCustom
          ? "data:image/svg+xml," + encodeURIComponent(m.icon!)
          : "",
        color: m.color ?? "",
        label: m.label,
      };
    });
  });

  // ── Computed: helpers ───────────────────────────────────────────────

  protected readonly hasVectorOverlays = computed(
    () => this.polylines().length > 0 || this.polygons().length > 0,
  );

  protected readonly svgViewBox = computed(
    () => `0 0 ${this.containerSize().width} ${this.containerSize().height}`,
  );

  // ── Lifecycle ───────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    const el = this.elRef.nativeElement;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      this.containerSize.set({
        width: Math.round(width),
        height: Math.round(height),
      });
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    this.destroyRef.onDestroy(() => ro.disconnect());
  }
}
