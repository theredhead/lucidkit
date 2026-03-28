import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIDensityDirective } from "../ui-density";
import { UIButton } from "../button/button.component";
import { UIMapView } from "./map-view.component";
import type {
  MapLatLng,
  MapMarker,
  MapPolygon,
  MapPolyline,
} from "./map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };
const BRUSSELS: MapLatLng = { lat: 50.8503, lng: 4.3517 };
const PARIS: MapLatLng = { lat: 48.8566, lng: 2.3522 };
const LONDON: MapLatLng = { lat: 51.5074, lng: -0.1278 };
const BERLIN: MapLatLng = { lat: 52.52, lng: 13.405 };
const PRAGUE: MapLatLng = { lat: 50.0755, lng: 14.4378 };
const ROME: MapLatLng = { lat: 41.9028, lng: 12.4964 };
const VIENNA: MapLatLng = { lat: 48.2082, lng: 16.3738 };

const EUROPE_CENTER: MapLatLng = { lat: 50.0, lng: 8.0 };

const CITY_MARKERS: MapMarker[] = [
  { position: AMSTERDAM, label: "Amsterdam" },
  { position: BRUSSELS, label: "Brussels" },
  { position: PARIS, label: "Paris", color: "#e04040" },
  { position: LONDON, label: "London", color: "#2d8a56" },
  { position: BERLIN, label: "Berlin", color: "#e5a00d" },
  { position: PRAGUE, label: "Prague" },
  { position: ROME, label: "Rome", color: "#e04040" },
  { position: VIENNA, label: "Vienna" },
];

const ROUTE_AMS_PAR: MapPolyline = {
  points: [AMSTERDAM, BRUSSELS, PARIS],
  color: "#e04040",
  width: 3,
  dashArray: "8 4",
};

const ROUTE_AMS_PAR_HIGHLIGHTED: MapPolyline = {
  ...ROUTE_AMS_PAR,
  highlighted: true,
  highlightColor: "#ffd700",
  highlightWidth: 5,
};

const BENELUX_POLYGON: MapPolygon = {
  points: [
    { lat: 53.5, lng: 3.4 },
    { lat: 53.5, lng: 7.2 },
    { lat: 49.5, lng: 6.4 },
    { lat: 49.5, lng: 2.5 },
  ],
  fillColor: "#3584e4",
  fillOpacity: 0.15,
  strokeColor: "#3584e4",
  strokeWidth: 2,
};

const BENELUX_HIGHLIGHTED: MapPolygon = {
  ...BENELUX_POLYGON,
  highlighted: true,
  highlightFillColor: "#e5a00d",
  highlightFillOpacity: 0.3,
  highlightStrokeColor: "#e5a00d",
  highlightStrokeWidth: 3,
};

const STAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" fill="#e5a00d" stroke="#b87f00" stroke-width="0.5"/>
</svg>`;

const FLAG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28">
  <line x1="3" y1="2" x2="3" y2="26" stroke="#444" stroke-width="1.5"/>
  <path d="M3 2h14l-4 5 4 5H3z" fill="#e04040" stroke="#b03030" stroke-width="0.5"/>
</svg>`;

// ── Story components ──────────────────────────────────────────────────

@Component({
  selector: "ui-map-view-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: ` <ui-map-view [center]="center" [zoom]="13" height="500px" /> `,
})
class MapViewBasicDemo {
  readonly center = AMSTERDAM;
}

@Component({
  selector: "ui-map-view-markers-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center"
      [zoom]="5"
      [markers]="markers"
      height="500px"
      ariaLabel="European cities"
    />
  `,
})
class MapViewMarkersDemo {
  readonly center = EUROPE_CENTER;
  readonly markers = CITY_MARKERS;
}

@Component({
  selector: "ui-map-view-route-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center"
      [zoom]="6"
      [markers]="markers"
      [polylines]="polylines"
      height="500px"
      ariaLabel="Amsterdam to Paris route"
    />
  `,
})
class MapViewRouteDemo {
  readonly center: MapLatLng = { lat: 50.5, lng: 3.7 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: PARIS, label: "Paris", color: "#e04040" },
  ];
  readonly polylines = [ROUTE_AMS_PAR];
}

@Component({
  selector: "ui-map-view-polygon-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center"
      [zoom]="6"
      [markers]="markers"
      [polygons]="polygons"
      height="500px"
      ariaLabel="Benelux region"
    />
  `,
})
class MapViewPolygonDemo {
  readonly center: MapLatLng = { lat: 51.5, lng: 5.0 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: { lat: 49.6117, lng: 6.1319 }, label: "Luxembourg" },
  ];
  readonly polygons = [BENELUX_POLYGON];
}

@Component({
  selector: "ui-map-view-highlight-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
      <div>
        <p style="margin:0 0 0.5rem;font-size:0.85rem;color:#888;">Normal</p>
        <ui-map-view
          [center]="center"
          [zoom]="6"
          [polylines]="[route]"
          [polygons]="[polygon]"
          [markers]="markers"
          height="360px"
        />
      </div>
      <div>
        <p style="margin:0 0 0.5rem;font-size:0.85rem;color:#888;">
          Highlighted
        </p>
        <ui-map-view
          [center]="center"
          [zoom]="6"
          [polylines]="[routeHighlighted]"
          [polygons]="[polygonHighlighted]"
          [markers]="markers"
          height="360px"
        />
      </div>
    </div>
  `,
})
class MapViewHighlightDemo {
  readonly center: MapLatLng = { lat: 51.0, lng: 4.5 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: PARIS, label: "Paris" },
  ];
  readonly route = ROUTE_AMS_PAR;
  readonly routeHighlighted = ROUTE_AMS_PAR_HIGHLIGHTED;
  readonly polygon = BENELUX_POLYGON;
  readonly polygonHighlighted = BENELUX_HIGHLIGHTED;
}

@Component({
  selector: "ui-map-view-custom-icons-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center"
      [zoom]="5"
      [markers]="markers"
      height="500px"
      ariaLabel="Cities with custom icons"
    />
  `,
})
class MapViewCustomIconsDemo {
  readonly center = EUROPE_CENTER;
  readonly markers: MapMarker[] = [
    {
      position: PARIS,
      label: "Paris",
      icon: STAR_ICON,
      size: [24, 24],
      anchor: [12, 12],
    },
    {
      position: LONDON,
      label: "London",
      icon: FLAG_ICON,
      size: [20, 28],
      anchor: [3, 26],
    },
    {
      position: BERLIN,
      label: "Berlin",
      icon: STAR_ICON,
      size: [24, 24],
      anchor: [12, 12],
    },
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: ROME, label: "Rome", color: "#e04040" },
  ];
}

@Component({
  selector: "ui-map-view-combined-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView, UIDensityDirective],
  template: `
    <ui-map-view
      uiDensity="comfortable"
      [center]="center"
      [zoom]="5"
      [markers]="markers"
      [polylines]="polylines"
      [polygons]="polygons"
      height="560px"
      ariaLabel="European overview"
    />
  `,
})
class MapViewCombinedDemo {
  readonly center = EUROPE_CENTER;
  readonly markers = CITY_MARKERS;
  readonly polylines: MapPolyline[] = [
    {
      points: [
        LONDON,
        PARIS,
        BRUSSELS,
        AMSTERDAM,
        BERLIN,
        PRAGUE,
        VIENNA,
        ROME,
      ],
      color: "#e04040",
      width: 2,
      dashArray: "6 3",
    },
  ];
  readonly polygons: MapPolygon[] = [BENELUX_POLYGON];
}

@Component({
  selector: "ui-map-view-toggle-highlight-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView, UIButton],
  template: `
    <div
      style="display:flex;justify-content:flex-end;gap:0.5rem;margin:0 0 0.75rem;"
    >
      <ui-button variant="outlined" (click)="toggle()">
        {{ highlighted() ? "Remove highlight" : "Highlight route" }}
      </ui-button>
    </div>
    <ui-map-view
      [center]="center"
      [zoom]="6"
      [markers]="markers"
      [polylines]="polylines()"
      [polygons]="polygons()"
      height="500px"
      ariaLabel="Toggle highlight demo"
    />
  `,
})
class MapViewToggleHighlightDemo {
  readonly center: MapLatLng = { lat: 51.0, lng: 4.5 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: PARIS, label: "Paris" },
  ];

  readonly highlighted = signal(false);

  readonly polylines = signal<MapPolyline[]>([ROUTE_AMS_PAR]);
  readonly polygons = signal<MapPolygon[]>([BENELUX_POLYGON]);

  toggle(): void {
    const next = !this.highlighted();
    this.highlighted.set(next);
    this.polylines.set([next ? ROUTE_AMS_PAR_HIGHLIGHTED : ROUTE_AMS_PAR]);
    this.polygons.set([next ? BENELUX_HIGHLIGHTED : BENELUX_POLYGON]);
  }
}

// ── Storybook meta ────────────────────────────────────────────────────

const meta: Meta<object> = {
  title: "@Theredhead/UI Kit/Map View",
  component: MapViewBasicDemo,
  tags: ["autodocs"],
  argTypes: {
    zoom: {
      control: { type: "range", min: 1, max: 19, step: 1 },
      description: "Zoom level (1–19).",
    },
    width: {
      control: "text",
      description: "CSS width of the map container.",
    },
    height: {
      control: "text",
      description: "CSS height of the map container.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the map.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`UIMapView` is a lightweight static map component that renders OpenStreetMap tiles centred on a given location with optional SVG overlays. It has **zero external dependencies** — all tile math and rendering uses native browser APIs.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<object>;

/**
 * **Basic** — A simple map centred on Amsterdam at zoom level 13.
 * No overlays — just the OpenStreetMap tile layer.
 */
export const Basic: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  [center]="{ lat: 52.3676, lng: 4.9041 }"
  [zoom]="13"
  height="500px"
  ariaLabel="Amsterdam map"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **With markers** — Three European city markers (Amsterdam, Paris, London)
 * with custom colours. Demonstrates the `MapMarker` interface including
 * `position`, `label`, and optional `color`.
 */
export const WithMarkers: Story = {
  decorators: [moduleMetadata({ imports: [MapViewMarkersDemo] })],
  render: () => ({ template: "<ui-map-view-markers-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  [center]="{ lat: 50.0, lng: 8.0 }"
  [zoom]="5"
  [markers]="markers"
  height="500px"
  ariaLabel="European cities"
/>

// Component class:
readonly markers: MapMarker[] = [
  { position: { lat: 52.37, lng: 4.90 }, label: 'Amsterdam' },
  { position: { lat: 48.86, lng: 2.35 }, label: 'Paris', color: '#e04040' },
  { position: { lat: 51.51, lng: -0.13 }, label: 'London', color: '#2d8a56' },
];`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Route polyline** — Draws a dashed red polyline from Amsterdam through
 * Brussels to Paris with markers at each waypoint. Demonstrates
 * `MapPolyline` with `dashArray` and custom `width`.
 */
export const RoutePolyline: Story = {
  decorators: [moduleMetadata({ imports: [MapViewRouteDemo] })],
  render: () => ({ template: "<ui-map-view-route-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  [center]="center"
  [zoom]="6"
  [markers]="markers"
  [polylines]="polylines"
  height="500px"
  ariaLabel="Amsterdam to Paris route"
/>

// Component class:
readonly polylines: MapPolyline[] = [{
  points: [amsterdam, brussels, paris],
  color: '#e04040',
  width: 3,
  dashArray: '8 4',
}];`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Polygon region** — Renders a semi-transparent blue polygon covering
 * the Benelux area. Demonstrates `MapPolygon` with `fillColor` and
 * `strokeColor`.
 */
export const PolygonRegion: Story = {
  decorators: [moduleMetadata({ imports: [MapViewPolygonDemo] })],
  render: () => ({ template: "<ui-map-view-polygon-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  [center]="center"
  [zoom]="6"
  [markers]="markers"
  [polygons]="polygons"
  height="500px"
  ariaLabel="Benelux region"
/>

// Component class:
readonly polygons: MapPolygon[] = [{
  points: [
    { lat: 53.5, lng: 3.4 },
    { lat: 53.5, lng: 7.2 },
    { lat: 49.5, lng: 6.4 },
    { lat: 49.5, lng: 2.5 },
  ],
  fillColor: 'rgba(59, 130, 246, 0.15)',
  strokeColor: '#3b82f6',
}];`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Highlight comparison** — Side-by-side maps comparing normal and
 * highlighted overlays. The highlighted version adds a golden glow
 * effect to both the route polyline and the region polygon.
 */
export const HighlightComparison: Story = {
  decorators: [moduleMetadata({ imports: [MapViewHighlightDemo] })],
  render: () => ({ template: "<ui-map-view-highlight-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<!-- Normal -->
<ui-map-view
  [center]="center" [zoom]="6"
  [polylines]="[route]" [polygons]="[polygon]"
  [markers]="markers" height="360px"
/>

<!-- Highlighted -->
<ui-map-view
  [center]="center" [zoom]="6"
  [polylines]="[routeHighlighted]" [polygons]="[polygonHighlighted]"
  [markers]="markers" height="360px"
/>

// Set highlighted: true on polylines/polygons to enable glow effect
const routeHighlighted: MapPolyline = {
  ...route,
  highlighted: true,
  highlightColor: '#ffd700',
  highlightWidth: 5,
};`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Custom marker icons** — Replaces the default pin markers with custom
 * SVG icons. Each marker specifies `iconSvg`, `iconSize`, and `iconAnchor`
 * for precise positioning.
 */
export const CustomMarkerIcons: Story = {
  decorators: [moduleMetadata({ imports: [MapViewCustomIconsDemo] })],
  render: () => ({ template: "<ui-map-view-custom-icons-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  [center]="center"
  [zoom]="5"
  [markers]="markers"
  height="500px"
  ariaLabel="Cities with custom icons"
/>

// Markers with custom SVG icons:
readonly markers: MapMarker[] = [
  {
    position: { lat: 52.37, lng: 4.90 },
    label: 'Amsterdam',
    iconSvg: '<svg>...</svg>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  },
];`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Combined overview** — All overlay types together: markers, polylines,
 * and polygons on a single map of Europe. Demonstrates the full range of
 * the component's capabilities.
 */
export const CombinedOverview: Story = {
  decorators: [moduleMetadata({ imports: [MapViewCombinedDemo] })],
  render: () => ({ template: "<ui-map-view-combined-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<ui-map-view
  uiDensity="comfortable"
  [center]="center"
  [zoom]="5"
  [markers]="markers"
  [polylines]="polylines"
  [polygons]="polygons"
  height="560px"
  ariaLabel="European overview"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Toggle highlight** — A button toggles the `highlighted` flag on
 * polylines and polygons at runtime. Demonstrates reactive overlay
 * updates without re-creating the map component.
 */
export const ToggleHighlight: Story = {
  decorators: [moduleMetadata({ imports: [MapViewToggleHighlightDemo] })],
  render: () => ({ template: "<ui-map-view-toggle-highlight-demo />" }),
  parameters: {
    docs: {
      source: {
        code: `<button (click)="toggle()">
  {{ highlighted() ? 'Remove highlight' : 'Highlight route' }}
</button>

<ui-map-view
  [center]="center"
  [zoom]="6"
  [markers]="markers"
  [polylines]="polylines()"
  [polygons]="polygons()"
  height="500px"
  ariaLabel="Toggle highlight demo"
/>

// Toggle highlighted state on overlays at runtime
readonly highlighted = signal(false);
toggle(): void { this.highlighted.update(v => !v); }`,
        language: "typescript",
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, and overlay types.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Tile rendering** — fetches and positions OpenStreetMap raster tiles based on `center` and `zoom`",
          "- **Markers** — drop pins with labels, custom colours, and optional custom SVG icons",
          "- **Polylines** — draw routes and paths with configurable colour, width, and dash patterns",
          "- **Polygons** — render filled regions with stroke and fill colours",
          "- **Highlight mode** — enable a glow effect on polylines and polygons with `highlighted: true`",
          "- **Accessible** — configurable `ariaLabel` for the map container",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `center` | `{ lat: number; lng: number }` | *(required)* | Geographic centre of the map |",
          "| `zoom` | `number` | `13` | Zoom level (1 = world, 18 = building) |",
          '| `height` | `string` | `"400px"` | CSS height of the map container |',
          "| `markers` | `MapMarker[]` | `[]` | Pin markers with position, label, colour |",
          "| `polylines` | `MapPolyline[]` | `[]` | Line overlays (routes, paths) |",
          "| `polygons` | `MapPolygon[]` | `[]` | Filled region overlays |",
          '| `ariaLabel` | `string` | `"Map"` | Accessible label |',
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
