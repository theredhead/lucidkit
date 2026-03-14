import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIMapView } from "./map-view.component";
import {
  DEFAULT_ATTRIBUTION,
  DEFAULT_TILE_URL,
  type MapMarker,
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

// ── Tests ─────────────────────────────────────────────────────────────

describe("UIMapView", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIMapView],
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
        fixture.nativeElement.querySelectorAll(".mv-tile"),
      );
      expect(tiles.length).toBeGreaterThan(0);
    });

    it("should set tile src from the URL template", () => {
      const { fixture } = createComponent();
      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".mv-tile");
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
        fixture.nativeElement.querySelector(".mv-tile");
      expect(tile.src).toContain("custom.tiles");
    });

    it("should position tiles absolutely", () => {
      const { fixture } = createComponent();
      const tile: HTMLImageElement =
        fixture.nativeElement.querySelector(".mv-tile");
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

      const markers = fixture.nativeElement.querySelectorAll(".mv-marker");
      expect(markers.length).toBe(2);
    });

    it("should render default pin SVG when no custom icon", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [testMarkers[0]]);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(".mv-marker svg");
      expect(svg).toBeTruthy();
      const pinPath = svg.querySelector(".mv-pin-body");
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
        fixture.nativeElement.querySelector(".mv-marker img");
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
        fixture.nativeElement.querySelector(".mv-pin-body");
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

      const svg = fixture.nativeElement.querySelector(".mv-vectors");
      expect(svg).toBeTruthy();
    });

    it("should render a path element for each polyline", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polylines", [route]);
      fixture.detectChanges();

      const paths = fixture.nativeElement.querySelectorAll(".mv-vectors path");
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

      const path = fixture.nativeElement.querySelector(".mv-vectors path");
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

      const paths = fixture.nativeElement.querySelectorAll(".mv-vectors path");
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute("d")).toContain("Z");
    });

    it("should apply fill and stroke from polygon definition", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("polygons", [region]);
      fixture.detectChanges();

      const path = fixture.nativeElement.querySelector(".mv-vectors path");
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

      const path = fixture.nativeElement.querySelector(".mv-vectors path");
      expect(path.getAttribute("fill")).toBe("#ffd700");
      expect(path.getAttribute("fill-opacity")).toBe("0.5");
      expect(path.getAttribute("stroke")).toBe("#ffd700");
      expect(path.getAttribute("stroke-width")).toBe("4");
    });
  });

  // ── Dark mode tiles ───────────────────────────────────────────────

  describe("dark mode tiles", () => {
    it("should add mv-dark-tiles class when darkModeTiles is true", () => {
      const { fixture } = createComponent();
      const viewport = fixture.nativeElement.querySelector(".mv-viewport");
      expect(viewport.classList.contains("mv-dark-tiles")).toBe(true);
    });

    it("should remove mv-dark-tiles class when darkModeTiles is false", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("darkModeTiles", false);
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(".mv-viewport");
      expect(viewport.classList.contains("mv-dark-tiles")).toBe(false);
    });
  });

  // ── Attribution ───────────────────────────────────────────────────

  describe("attribution", () => {
    it("should render default OSM attribution", () => {
      const { fixture } = createComponent();
      const attr: HTMLElement =
        fixture.nativeElement.querySelector(".mv-attribution");
      expect(attr).toBeTruthy();
      expect(attr.textContent).toContain("OpenStreetMap");
    });

    it("should render custom attribution", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("attribution", "Custom tiles by Acme");
      fixture.detectChanges();

      const attr: HTMLElement =
        fixture.nativeElement.querySelector(".mv-attribution");
      expect(attr.textContent).toContain("Acme");
    });

    it("should not render attribution when empty", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("attribution", "");
      fixture.detectChanges();

      const attr = fixture.nativeElement.querySelector(".mv-attribution");
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
      const viewport = fixture.nativeElement.querySelector(".mv-viewport");
      expect(viewport.getAttribute("role")).toBe("img");
    });

    it('should set aria-label="Map" by default', () => {
      const { fixture } = createComponent();
      const viewport = fixture.nativeElement.querySelector(".mv-viewport");
      expect(viewport.getAttribute("aria-label")).toBe("Map");
    });

    it("should forward custom ariaLabel", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("ariaLabel", "City overview");
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(".mv-viewport");
      expect(viewport.getAttribute("aria-label")).toBe("City overview");
    });

    it("should set aria-label on markers with labels", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 }, label: "Amsterdam" },
      ]);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector(".mv-marker");
      expect(marker.getAttribute("aria-label")).toBe("Amsterdam");
      expect(marker.getAttribute("role")).toBe("img");
    });

    it("should not set role on markers without labels", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 } },
      ]);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector(".mv-marker");
      expect(marker.getAttribute("role")).toBeNull();
    });

    it("should hide default pin SVG from assistive tech", () => {
      const { fixture } = createComponent();
      fixture.componentRef.setInput("markers", [
        { position: { lat: 52.37, lng: 4.89 }, label: "Test" },
      ]);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector(".mv-marker svg");
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  // ── No overlays ───────────────────────────────────────────────────

  describe("no overlays", () => {
    it("should not render SVG overlay when no vectors", () => {
      const { fixture } = createComponent();
      const svg = fixture.nativeElement.querySelector(".mv-vectors");
      expect(svg).toBeNull();
    });
  });
});
