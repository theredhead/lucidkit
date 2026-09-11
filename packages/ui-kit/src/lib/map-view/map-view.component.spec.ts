import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIMapView } from "./map-view.component";
import {
  DEFAULT_ATTRIBUTION,
  DEFAULT_TILE_URL,
  type MapLatLng,
  type MapViewDrawMode,
  type MapViewGeoJsonFeatureCollection,
  type MapViewGeoJsonLineString,
  type MapViewGeoJsonPolygon,
  type MapMarker,
  type MapViewInteractionMode,
  type MapPolygon,
  type MapPolyline,
} from "./map-view.model";

// ── ResizeObserver mock ───────────────────────────────────────────────

const originalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = class MockResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

// ── Helpers ───────────────────────────────────────────────────────────

function createComponent(): {
  fixture: ComponentFixture<UIMapView>;
  component: UIMapView;
} {
  const fixture = TestBed.createComponent(UIMapView);
  const component = fixture.componentInstance;

  // Mock host element dimensions (jsdom has no layout engine).
  fixture.nativeElement.getBoundingClientRect = () => ({
    width: 800,
    height: 400,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    toJSON: () => ({}),
  });

  // Set required inputs
  fixture.componentRef.setInput("center", { lat: 52.37, lng: 4.89 });
  fixture.componentRef.setInput("zoom", 10);

  fixture.detectChanges(); // triggers ngAfterViewInit → measure()

  return { fixture, component };
}

@Component({
  standalone: true,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center()"
      [zoom]="zoom()"
      [interactionMode]="interactionMode()"
      [drawMode]="drawMode()"
      [(geoJsonLine)]="lineGeometry"
      [(geoJsonPolygon)]="polygonGeometry"
    />
  `,
})
class MapEditorHost {
  readonly center = signal<MapLatLng>({ lat: 52.37, lng: 4.89 });
  readonly zoom = signal(10);
  readonly interactionMode = signal<MapViewInteractionMode>("interactive");
  readonly drawMode = signal<MapViewDrawMode>("none");
  readonly lineGeometry = signal<MapViewGeoJsonLineString | null>(null);
  readonly polygonGeometry = signal<MapViewGeoJsonPolygon | null>(null);
}

@Component({
  standalone: true,
  imports: [UIMapView],
  template: `
    <ui-map-view
      [center]="center()"
      [zoom]="zoom()"
      [interactionMode]="interactionMode()"
      [drawMode]="drawMode()"
      [(geoJsonFeatureCollection)]="featureCollection"
    />
  `,
})
class MapFeatureCollectionEditorHost {
  readonly center = signal<MapLatLng>({ lat: 52.37, lng: 4.89 });
  readonly zoom = signal(10);
  readonly interactionMode = signal<MapViewInteractionMode>("interactive");
  readonly drawMode = signal<MapViewDrawMode>("none");
  readonly featureCollection = signal<MapViewGeoJsonFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
}

function createEditorHost(): {
  fixture: ComponentFixture<MapEditorHost>;
  host: MapEditorHost;
  mapElement: HTMLElement;
  viewport: HTMLElement;
} {
  const fixture = TestBed.createComponent(MapEditorHost);
  const host = fixture.componentInstance;
  const mapElement: HTMLElement =
    fixture.nativeElement.querySelector("ui-map-view");

  mapElement.getBoundingClientRect = () => ({
    width: 800,
    height: 400,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    toJSON: () => ({}),
  });

  fixture.detectChanges();

  return {
    fixture,
    host,
    mapElement,
    viewport: fixture.nativeElement.querySelector(".viewport"),
  };
}

function createFeatureCollectionEditorHost(): {
  fixture: ComponentFixture<MapFeatureCollectionEditorHost>;
  host: MapFeatureCollectionEditorHost;
  mapElement: HTMLElement;
  viewport: HTMLElement;
} {
  const fixture = TestBed.createComponent(MapFeatureCollectionEditorHost);
  const host = fixture.componentInstance;
  const mapElement: HTMLElement =
    fixture.nativeElement.querySelector("ui-map-view");

  mapElement.getBoundingClientRect = () => ({
    width: 800,
    height: 400,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    toJSON: () => ({}),
  });

  fixture.detectChanges();

  return {
    fixture,
    host,
    mapElement,
    viewport: fixture.nativeElement.querySelector(".viewport"),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("UIMapView", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIMapView, MapEditorHost, MapFeatureCollectionEditorHost],
    }).compileComponents();
  });

  it("should create", () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  // ── Defaults ──────────────────────────────────────────────────────

  describe("defaults", () => {
    it("should default tileUrl to OSM", () => {
      const { component } = createComponent();
      expect(component.tileUrl()).toBe(DEFAULT_TILE_URL);
    });

    it('should default width to "100%"', () => {
      const { component } = createComponent();
      expect(component.width()).toBe("100%");
    });

    it('should default height to "400px"', () => {
      const { component } = createComponent();
      expect(component.height()).toBe("400px");
    });

    it("should default attribution to OSM attribution", () => {
      const { component } = createComponent();
      expect(component.attribution()).toBe(DEFAULT_ATTRIBUTION);
    });

    it("should default darkModeTiles to true", () => {
      const { component } = createComponent();
      expect(component.darkModeTiles()).toBe(true);
    });

    it('should default interactionMode to "static"', () => {
      const { component } = createComponent();
      expect(component.interactionMode()).toBe("static");
    });

    it("should default markers to empty array", () => {
      const { component } = createComponent();
      expect(component.markers()).toEqual([]);
    });

    it("should default polylines to empty array", () => {
      const { component } = createComponent();
      expect(component.polylines()).toEqual([]);
    });

    it("should default polygons to empty array", () => {
      const { component } = createComponent();
      expect(component.polygons()).toEqual([]);
    });
  });

  // ── Tile rendering ────────────────────────────────────────────────

  describe("tiles", () => {
    it("should render tile images", () => {
      const { fixture } = createComponent();
      const tiles: HTMLImageElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".tile"),
      );
      expect(tiles.length).toBeGreaterThan(0);
    });

    it("should set tile src from the URL template", () => {
      const { fixture } = createComponent();
      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".tile");
      expect(tile.src).toContain("tile.openstreetmap.org");
      expect(tile.src).toContain("/10/");
    });

    it("should use a custom tile URL template", () => {
      const fixture = TestBed.createComponent(UIMapView);
      fixture.nativeElement.getBoundingClientRect = () => ({
        width: 800,
        height: 400,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 400,
        right: 800,
        toJSON: () => ({}),
      });
      fixture.componentRef.setInput("center", { lat: 0, lng: 0 });
      fixture.componentRef.setInput("zoom", 2);
      fixture.componentRef.setInput(
        "tileUrl",
        "https://custom.tiles/{z}/{x}/{y}.png",
      );
      fixture.detectChanges();

      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".tile");
      expect(tile.src).toContain("custom.tiles");
    });

    it("should position tiles absolutely", () => {
      const { fixture } = createComponent();
      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".tile");
      expect(tile.style.left).toBeTruthy();
      expect(tile.style.top).toBeTruthy();
    });
  });

  // ── Markers ───────────────────────────────────────────────────────

  describe("markers", () => {
    const testMarkers: MapMarker[] = [
      { position: { lat: 52.37, lng: 4.89 }, label: "Amsterdam" },
      { position: { lat: 52.52, lng: 13.405 }, label: "Berlin" },
    ];

    it("should render marker elements", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", testMarkers);
      fixture.detectChanges();

      const markers = fixture.nativeElement.querySelectorAll(".marker");
      expect(markers.length).toBe(2);
    });

    it("should render default pin SVG when no custom icon", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [testMarkers[0]]);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(".marker svg");
      expect(svg).toBeTruthy();
      const pinPath = svg.querySelector(".pin-body");
      expect(pinPath).toBeTruthy();
    });

    it("should render custom icon as img with data URI", () => {
      const customSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="8" fill="red"/></svg>';
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        {
          position: { lat: 52.37, lng: 4.89 },
          icon: customSvg,
          size: [20, 20] as [number, number],
          anchor: [10, 10] as [number, number],
        },
      ]);
      fixture.detectChanges();

      const img: HTMLImageElement =
        fixture.nativeElement.querySelector(".marker img");
      expect(img).toBeTruthy();
      expect(img.src).toContain("data:image/svg+xml,");
    });

    it("should apply custom color to default pin via inline style", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 }, color: "#ff0000" },
      ]);
      fixture.detectChanges();

      const pinBody: SVGPathElement =
        fixture.nativeElement.querySelector(".pin-body");
      // jsdom preserves the raw value, not a computed rgb()
      expect(pinBody.style.fill).toBe("#ff0000");
    });
  });

  // ── Polylines ─────────────────────────────────────────────────────

  describe("polylines", () => {
    const route: MapPolyline = {
      points: [
        { lat: 52.37, lng: 4.89 },
        { lat: 50.85, lng: 4.35 },
        { lat: 48.86, lng: 2.35 },
      ],
      color: "#e04040",
      width: 3,
    };

    it("should render an SVG overlay when polylines are provided", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polylines", [route]);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(".vectors");
      expect(svg).toBeTruthy();
    });

    it("should render a path element for each polyline", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polylines", [route]);
      fixture.detectChanges();

      const paths = fixture.nativeElement.querySelectorAll(".vectors path");
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute("d")).toContain("M");
      expect(paths[0].getAttribute("d")).toContain("L");
    });

    it("should use highlight styles when highlighted", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polylines", [
        {
          ...route,
          highlighted: true,
          highlightColor: "#gold",
          highlightWidth: 5,
        },
      ]);
      fixture.detectChanges();

      const path = fixture.nativeElement.querySelector(".vectors path");
      expect(path.getAttribute("stroke")).toBe("#gold");
      expect(path.getAttribute("stroke-width")).toBe("5");
    });
  });

  // ── Polygons ──────────────────────────────────────────────────────

  describe("polygons", () => {
    const region: MapPolygon = {
      points: [
        { lat: 53.5, lng: 3.4 },
        { lat: 53.5, lng: 7.2 },
        { lat: 49.5, lng: 6.4 },
        { lat: 49.5, lng: 2.5 },
      ],
      fillColor: "#3584e4",
      strokeColor: "#3584e4",
    };

    it("should render polygon path elements", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polygons", [region]);
      fixture.detectChanges();

      const paths = fixture.nativeElement.querySelectorAll(".vectors path");
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute("d")).toContain("Z");
    });

    it("should apply fill and stroke from polygon definition", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polygons", [region]);
      fixture.detectChanges();

      const path = fixture.nativeElement.querySelector(".vectors path");
      expect(path.getAttribute("fill")).toBe("#3584e4");
      expect(path.getAttribute("stroke")).toBe("#3584e4");
    });

    it("should use highlight styles when highlighted", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polygons", [
        {
          ...region,
          highlighted: true,
          highlightFillColor: "#ffd700",
          highlightFillOpacity: 0.5,
          highlightStrokeColor: "#ffd700",
          highlightStrokeWidth: 4,
        },
      ]);
      fixture.detectChanges();

      const path = fixture.nativeElement.querySelector(".vectors path");
      expect(path.getAttribute("fill")).toBe("#ffd700");
      expect(path.getAttribute("fill-opacity")).toBe("0.5");
      expect(path.getAttribute("stroke")).toBe("#ffd700");
      expect(path.getAttribute("stroke-width")).toBe("4");
    });
  });

  // ── Dark mode tiles ───────────────────────────────────────────────

  describe("dark mode tiles", () => {
    it("should add dark-tiles class when darkModeTiles is true", () => {
      const { fixture } = createComponent();
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.classList.contains("dark-tiles")).toBe(true);
    });

    it("should remove dark-tiles class when darkModeTiles is false", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("darkModeTiles", false);
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.classList.contains("dark-tiles")).toBe(false);
    });
  });

  // ── Attribution ───────────────────────────────────────────────────

  describe("attribution", () => {
    it("should render default OSM attribution", () => {
      const { fixture } = createComponent();
      const attr: HTMLElement =
        fixture.nativeElement.querySelector(".attribution");
      expect(attr).toBeTruthy();
      expect(attr.textContent).toContain("OpenStreetMap");
    });

    it("should render custom attribution", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("attribution", "Custom tiles by Acme");
      fixture.detectChanges();

      const attr: HTMLElement =
        fixture.nativeElement.querySelector(".attribution");
      expect(attr.textContent).toContain("Acme");
    });

    it("should not render attribution when empty", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("attribution", "");
      fixture.detectChanges();

      const attr = fixture.nativeElement.querySelector(".attribution");
      expect(attr).toBeNull();
    });
  });

  // ── Sizing ────────────────────────────────────────────────────────

  describe("sizing", () => {
    it("should bind width and height to host style", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("width", "600px");
      fixture.componentRef.setInput("height", "300px");
      fixture.detectChanges();

      const host: HTMLElement = fixture.nativeElement;
      expect(host.style.width).toBe("600px");
      expect(host.style.height).toBe("300px");
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────

  describe("accessibility", () => {
    it('should set role="img" on the viewport', () => {
      const { fixture } = createComponent();
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("role")).toBe("img");
    });

    it("should make the viewport focusable and region-role in interactive mode", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput(
        "interactionMode",
        "interactive" as MapViewInteractionMode,
      );
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("role")).toBe("region");
      expect(viewport.getAttribute("tabindex")).toBe("0");
    });

    it('should set aria-label="Map" by default', () => {
      const { fixture } = createComponent();
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("aria-label")).toBe("Map");
    });

    it("should forward custom ariaLabel", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("ariaLabel", "City overview");
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("aria-label")).toBe("City overview");
    });

    it("should set aria-label on markers with labels", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 }, label: "Amsterdam" },
      ]);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector(".marker");
      expect(marker.getAttribute("aria-label")).toBe("Amsterdam");
      expect(marker.getAttribute("role")).toBe("img");
    });

    it("should not set role on markers without labels", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 } },
      ]);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector(".marker");
      expect(marker.getAttribute("role")).toBeNull();
    });

    it("should hide default pin SVG from assistive tech", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 }, label: "Test" },
      ]);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(".marker svg");
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  // ── No overlays ───────────────────────────────────────────────────

  describe("no overlays", () => {
    it("should not render SVG overlay when no vectors", () => {
      const { fixture } = createComponent();
      const svg = fixture.nativeElement.querySelector(".vectors");
      expect(svg).toBeNull();
    });
  });

  // ── Interactive mode ──────────────────────────────────────────────

  describe("interactive mode", () => {
    it("should zoom with mouse wheel and emit zoomChange", () => {
      const { fixture, component } = createComponent();
      fixture.componentRef.setInput(
        "interactionMode",
        "interactive" as MapViewInteractionMode,
      );
      fixture.detectChanges();

      const zoomValues: number[] = [];
      const sub = component.zoomChange.subscribe((value) =>
        zoomValues.push(value),
      );

      const viewport: HTMLElement =
        fixture.nativeElement.querySelector(".viewport");
      viewport.dispatchEvent(
        new WheelEvent("wheel", { deltaY: -120, cancelable: true }),
      );
      fixture.detectChanges();

      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".tile");
      expect(tile.src).toContain("/11/");
      expect(zoomValues).toEqual([11]);
      sub.unsubscribe();
    });

    it("should pan with arrow keys and emit centerChange", () => {
      const { fixture, component } = createComponent();
      fixture.componentRef.setInput(
        "interactionMode",
        "interactive" as MapViewInteractionMode,
      );
      fixture.detectChanges();

      const centers: MapLatLng[] = [];
      const sub = component.centerChange.subscribe((value) =>
        centers.push(value),
      );

      const viewport: HTMLElement =
        fixture.nativeElement.querySelector(".viewport");
      viewport.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();

      expect(centers.length).toBe(1);
      expect(centers[0].lng).toBeGreaterThan(4.89);
      sub.unsubscribe();
    });

    it("should draw a line into the external signal", () => {
      const { fixture, host, viewport } = createEditorHost();
      host.drawMode.set("line");
      fixture.detectChanges();

      viewport.dispatchEvent(
        new MouseEvent("click", {
          clientX: 300,
          clientY: 180,
          bubbles: true,
        }),
      );
      viewport.dispatchEvent(
        new MouseEvent("click", {
          clientX: 500,
          clientY: 220,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(host.lineGeometry()?.type).toBe("LineString");
      expect(host.lineGeometry()?.coordinates.length).toBe(2);
    });

    it("should insert a control point when clicking a line segment", () => {
      const { fixture, host } = createEditorHost();
      host.lineGeometry.set({
        type: "LineString",
        coordinates: [
          [4.89, 52.37],
          [5.25, 52.37],
        ],
      });
      fixture.detectChanges();

      const segment: SVGPathElement =
        fixture.nativeElement.querySelector(".edit-segment.line");
      segment.dispatchEvent(
        new MouseEvent("click", {
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(host.lineGeometry()?.coordinates.length).toBe(3);
    });

    it("should drag polygon vertices and sync the external signal", () => {
      const { fixture, host } = createEditorHost();
      host.polygonGeometry.set({
        type: "Polygon",
        coordinates: [
          [
            [4.89, 52.45],
            [5.02, 52.28],
            [4.76, 52.28],
            [4.89, 52.45],
          ],
        ],
      });
      fixture.detectChanges();

      const before = host.polygonGeometry()?.coordinates[0][0];
      const handle: SVGCircleElement = fixture.nativeElement.querySelector(
        ".vertex-handle.polygon",
      );

      handle.dispatchEvent(
        new MouseEvent("mousedown", {
          button: 0,
          clientX: 400,
          clientY: 120,
          bubbles: true,
        }),
      );
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: 460,
          clientY: 160,
          bubbles: true,
        }),
      );
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      fixture.detectChanges();

      const after = host.polygonGeometry()?.coordinates[0][0];
      expect(after).not.toEqual(before);
      expect(host.polygonGeometry()?.coordinates[0].at(-1)).toEqual(after);
    });

    it("should add new features into an external feature collection", () => {
      const { fixture, host, viewport } = createFeatureCollectionEditorHost();
      host.drawMode.set("line");
      fixture.detectChanges();

      viewport.dispatchEvent(
        new MouseEvent("click", {
          clientX: 300,
          clientY: 180,
          bubbles: true,
        }),
      );
      viewport.dispatchEvent(
        new MouseEvent("click", {
          clientX: 500,
          clientY: 220,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(host.featureCollection().features).toHaveLength(1);
      expect(host.featureCollection().features[0].geometry.type).toBe(
        "LineString",
      );
      expect(
        host.featureCollection().features[0].geometry.coordinates,
      ).toHaveLength(2);
    });

    it("should delete a selected vertex from a feature collection line", () => {
      const { fixture, host, viewport } = createFeatureCollectionEditorHost();
      host.featureCollection.set({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [4.89, 52.37],
                [5.12, 52.37],
              ],
            },
            properties: null,
          },
        ],
      });
      fixture.detectChanges();

      const handle: SVGCircleElement = fixture.nativeElement.querySelector(
        ".vertex-handle.line",
      );
      handle.dispatchEvent(
        new MouseEvent("mousedown", {
          button: 0,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      viewport.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
      );
      fixture.detectChanges();

      const geometry = host.featureCollection().features[0].geometry;
      expect(geometry.type).toBe("LineString");
      if (geometry.type === "LineString") {
        expect(geometry.coordinates).toHaveLength(1);
      }
    });
  });
});
