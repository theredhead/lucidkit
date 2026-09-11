import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";

import { UISurface } from "@theredhead/lucid-foundation";

import {
  DEFAULT_ATTRIBUTION,
  DEFAULT_MARKER_SIZE,
  DEFAULT_TILE_URL,
  type MapLatLng,
  type MapViewDrawMode,
  type MapViewGeoJsonFeature,
  type MapViewGeoJsonFeatureCollection,
  type MapViewGeoJsonGeometry,
  type MapViewGeoJsonLineString,
  type MapViewGeoJsonPolygon,
  type MapViewGeoJsonPosition,
  type MapViewInteractionMode,
  type MapMarker,
  type MapPolygon,
  type MapPolyline,
} from "./map-view.model";
import {
  closePolygonRing,
  computeTiles,
  geoJsonPositionToLatLng,
  latLngToGeoJsonPosition,
  latLngToPixel,
  latLngToViewport,
  openPolygonRing,
  pixelToLatLng,
  pointsToPolygonPath,
  pointsToPolylinePath,
  viewportToLatLng,
  type TileDescriptor,
} from "./map-view.utils";

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
  dataUri: string;
  color: string;
  label: string | undefined;
}

/** @internal */
interface MapDragState {
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  zoom: number;
}

/** @internal */
interface EditableSource {
  mode: "legacy" | "feature";
  shape: "line" | "polygon";
  featureIndex?: number;
}

/** @internal */
interface EditableVertexRef extends EditableSource {
  index: number;
}

/** @internal */
interface EditableEntry extends EditableSource {
  key: string;
  points: MapLatLng[];
}

/** @internal */
interface EditableShape {
  key: string;
  shape: "line" | "polygon";
  path: string;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
}

/** @internal */
interface EditableHandle extends EditableVertexRef {
  key: string;
  x: number;
  y: number;
  selected: boolean;
}

/** @internal */
interface EditableSegment extends EditableSource {
  key: string;
  insertIndex: number;
  path: string;
}

const MIN_ZOOM = 0;
const MAX_ZOOM = 19;
const KEYBOARD_PAN_STEP_PX = 80;

function clampZoom(zoom: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(zoom)));
}

function drawModeToShape(mode: MapViewDrawMode): "line" | "polygon" | null {
  if (mode === "line") return "line";
  if (mode === "polygon") return "polygon";
  return null;
}

function sameSource(
  left: EditableSource | null,
  right: EditableSource | null,
): boolean {
  if (!left || !right) return false;
  return (
    left.mode === right.mode &&
    left.shape === right.shape &&
    left.featureIndex === right.featureIndex
  );
}

function sameVertex(
  left: EditableVertexRef | null,
  right: EditableVertexRef | null,
): boolean {
  return (
    sameSource(left, right) && !!left && !!right && left.index === right.index
  );
}

@Component({
  selector: "ui-map-view",
  standalone: true,
  templateUrl: "./map-view.component.html",
  styleUrl: "./map-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-map-view",
    "[style.width]": "width()",
    "[style.height]": "height()",
  },
})
export class UIMapView implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private mapDragState: MapDragState | null = null;
  private vertexDragState: EditableVertexRef | null = null;
  private suppressNextClick = false;

  private readonly onWindowMouseMove = (event: MouseEvent) => {
    this.handleMouseMove(event);
  };

  private readonly onWindowMouseUp = () => {
    this.stopDrag();
  };

  private readonly inputSyncEffect = effect(() => {
    this.currentCenter.set(this.center());
    this.currentZoom.set(clampZoom(this.zoom()));
  });

  private readonly drawModeEffect = effect(() => {
    const shape = drawModeToShape(this.drawMode());
    const current = this.currentDrawingSource();
    if (!shape || (current && current.shape !== shape)) {
      this.currentDrawingSource.set(null);
    }
  });

  readonly center = input.required<MapLatLng>();

  readonly zoom = input.required<number>();

  readonly tileUrl = input(DEFAULT_TILE_URL);

  readonly width = input("100%");

  readonly height = input("400px");

  readonly attribution = input(DEFAULT_ATTRIBUTION);

  readonly ariaLabel = input("Map");

  readonly interactionMode = input<MapViewInteractionMode>("static");

  readonly drawMode = input<MapViewDrawMode>("none");

  readonly markers = input<MapMarker[]>([]);

  readonly polylines = input<MapPolyline[]>([]);

  readonly polygons = input<MapPolygon[]>([]);

  readonly darkModeTiles = input(true);

  readonly centerChange = output<MapLatLng>();

  readonly zoomChange = output<number>();

  readonly geoJsonLine = model<MapViewGeoJsonLineString | null>(null);

  readonly geoJsonPolygon = model<MapViewGeoJsonPolygon | null>(null);

  readonly geoJsonFeatureCollection =
    model<MapViewGeoJsonFeatureCollection | null>(null);

  protected readonly containerSize = signal({ width: 0, height: 0 });

  protected readonly currentCenter = signal<MapLatLng | null>(null);

  protected readonly currentZoom = signal<number | null>(null);

  protected readonly isDragging = signal(false);

  protected readonly currentDrawingSource = signal<EditableSource | null>(null);

  protected readonly draftHoverPosition = signal<MapViewGeoJsonPosition | null>(
    null,
  );

  protected readonly selectedVertex = signal<EditableVertexRef | null>(null);

  protected readonly isInteractive = computed(
    () => this.interactionMode() === "interactive",
  );

  protected readonly viewportRole = computed(() =>
    this.isInteractive() ? "region" : "img",
  );

  protected readonly viewportTabIndex = computed(() =>
    this.isInteractive() ? 0 : null,
  );

  protected readonly activeCenter = computed(
    () => this.currentCenter() ?? this.center(),
  );

  protected readonly activeZoom = computed(
    () => this.currentZoom() ?? clampZoom(this.zoom()),
  );

  protected readonly isFeatureCollectionMode = computed(
    () => this.geoJsonFeatureCollection() !== null,
  );

  protected readonly tiles = computed<TileDescriptor[]>(() => {
    const { width: viewportWidth, height: viewportHeight } =
      this.containerSize();
    const center = this.activeCenter();
    return computeTiles(
      center.lat,
      center.lng,
      this.activeZoom(),
      viewportWidth,
      viewportHeight,
      this.tileUrl(),
    );
  });

  protected readonly renderedPolylines = computed<RenderedPolyline[]>(() => {
    const { width: viewportWidth, height: viewportHeight } =
      this.containerSize();
    if (viewportWidth === 0 || viewportHeight === 0) return [];

    const center = this.activeCenter();
    const zoom = this.activeZoom();
    return this.polylines().map((polyline) => {
      const highlighted = polyline.highlighted ?? false;
      const points = polyline.points.map((point) =>
        latLngToViewport(
          point.lat,
          point.lng,
          zoom,
          center.lat,
          center.lng,
          viewportWidth,
          viewportHeight,
        ),
      );

      return {
        path: pointsToPolylinePath(points),
        stroke: highlighted
          ? (polyline.highlightColor ?? "var(--mv-highlight)")
          : (polyline.color ?? "var(--mv-accent)"),
        strokeWidth: highlighted
          ? (polyline.highlightWidth ?? 4)
          : (polyline.width ?? 2),
        dashArray: polyline.dashArray ?? null,
      };
    });
  });

  protected readonly renderedPolygons = computed<RenderedPolygon[]>(() => {
    const { width: viewportWidth, height: viewportHeight } =
      this.containerSize();
    if (viewportWidth === 0 || viewportHeight === 0) return [];

    const center = this.activeCenter();
    const zoom = this.activeZoom();
    return this.polygons().map((polygon) => {
      const highlighted = polygon.highlighted ?? false;
      const points = polygon.points.map((point) =>
        latLngToViewport(
          point.lat,
          point.lng,
          zoom,
          center.lat,
          center.lng,
          viewportWidth,
          viewportHeight,
        ),
      );

      return {
        path: pointsToPolygonPath(points),
        fill: highlighted
          ? (polygon.highlightFillColor ??
            polygon.fillColor ??
            "var(--mv-accent)")
          : (polygon.fillColor ?? "var(--mv-accent)"),
        fillOpacity: highlighted
          ? (polygon.highlightFillOpacity ?? 0.4)
          : (polygon.fillOpacity ?? 0.2),
        stroke: highlighted
          ? (polygon.highlightStrokeColor ??
            polygon.strokeColor ??
            "var(--mv-accent)")
          : (polygon.strokeColor ?? "var(--mv-accent)"),
        strokeWidth: highlighted
          ? (polygon.highlightStrokeWidth ?? 3)
          : (polygon.strokeWidth ?? 2),
      };
    });
  });

  protected readonly renderedMarkers = computed<RenderedMarker[]>(() => {
    const { width: viewportWidth, height: viewportHeight } =
      this.containerSize();
    if (viewportWidth === 0 || viewportHeight === 0) return [];

    const center = this.activeCenter();
    const zoom = this.activeZoom();
    return this.markers().map((marker) => {
      const [markerWidth, markerHeight] = marker.size ?? DEFAULT_MARKER_SIZE;
      const [anchorX, anchorY] = marker.anchor ?? [
        markerWidth / 2,
        markerHeight,
      ];
      const point = latLngToViewport(
        marker.position.lat,
        marker.position.lng,
        zoom,
        center.lat,
        center.lng,
        viewportWidth,
        viewportHeight,
      );
      const isCustom = !!marker.icon;

      return {
        left: point.x - anchorX,
        top: point.y - anchorY,
        width: markerWidth,
        height: markerHeight,
        isCustom,
        dataUri: isCustom
          ? "data:image/svg+xml," + encodeURIComponent(marker.icon!)
          : "",
        color: marker.color ?? "",
        label: marker.label,
      };
    });
  });

  protected readonly legacyEditableEntries = computed<EditableEntry[]>(() => {
    const entries: EditableEntry[] = [];
    const line = this.geoJsonLine();
    if (line) {
      entries.push({
        key: "legacy-line",
        mode: "legacy",
        shape: "line",
        points: line.coordinates.map(geoJsonPositionToLatLng),
      });
    }

    const polygon = this.geoJsonPolygon();
    if (polygon) {
      entries.push({
        key: "legacy-polygon",
        mode: "legacy",
        shape: "polygon",
        points: openPolygonRing(polygon.coordinates[0] ?? []).map(
          geoJsonPositionToLatLng,
        ),
      });
    }

    return entries;
  });

  protected readonly featureCollectionEditableEntries = computed<
    EditableEntry[]
  >(() => {
    const collection = this.geoJsonFeatureCollection();
    if (!collection) return [];

    return collection.features.flatMap<EditableEntry>(
      (feature, featureIndex) => {
        if (feature.geometry.type === "LineString") {
          return [
            {
              key: `feature-line-${featureIndex}`,
              mode: "feature" as const,
              shape: "line" as const,
              featureIndex,
              points: feature.geometry.coordinates.map(geoJsonPositionToLatLng),
            },
          ];
        }

        if (feature.geometry.type === "Polygon") {
          return [
            {
              key: `feature-polygon-${featureIndex}`,
              mode: "feature" as const,
              shape: "polygon" as const,
              featureIndex,
              points: openPolygonRing(
                feature.geometry.coordinates[0] ?? [],
              ).map(geoJsonPositionToLatLng),
            },
          ];
        }

        return [];
      },
    );
  });

  protected readonly editableEntries = computed<EditableEntry[]>(() =>
    this.isFeatureCollectionMode()
      ? this.featureCollectionEditableEntries()
      : this.legacyEditableEntries(),
  );

  protected readonly renderedEditableShapes = computed<EditableShape[]>(() =>
    this.editableEntries().flatMap<EditableShape>((entry) => {
      const previewPoint = sameSource(this.currentDrawingSource(), entry)
        ? this.draftHoverPosition()
        : null;
      const previewPoints = previewPoint
        ? [...entry.points, geoJsonPositionToLatLng(previewPoint)]
        : entry.points;
      const points = this.toViewportPoints(previewPoints);
      if (points.length === 0) return [];

      const isDraft = previewPoint !== null;

      if (entry.shape === "line") {
        return [
          {
            key: `${entry.key}-shape`,
            shape: "line",
            path: pointsToPolylinePath(points),
            fill: "transparent",
            fillOpacity: 0,
            stroke: "var(--mv-edit-line, #0059b3)",
            strokeWidth: 3,
          },
        ];
      }

      return [
        {
          key: `${entry.key}-shape`,
          shape: "polygon",
          path:
            !isDraft && points.length >= 3
              ? pointsToPolygonPath(points)
              : pointsToPolylinePath(points),
          fill: "var(--mv-edit-polygon-fill, #e8a208)",
          fillOpacity: !isDraft && points.length >= 3 ? 0.2 : 0,
          stroke: "var(--mv-edit-polygon-stroke, #8a5a00)",
          strokeWidth: 3,
        },
      ];
    }),
  );

  protected readonly editableHandles = computed<EditableHandle[]>(() =>
    this.editableEntries().flatMap((entry) =>
      this.toViewportPoints(entry.points).map((point, index) => ({
        key: `${entry.key}-handle-${index}`,
        mode: entry.mode,
        shape: entry.shape,
        featureIndex: entry.featureIndex,
        index,
        x: point.x,
        y: point.y,
        selected: sameVertex(this.selectedVertex(), {
          mode: entry.mode,
          shape: entry.shape,
          featureIndex: entry.featureIndex,
          index,
        }),
      })),
    ),
  );

  protected readonly editableSegments = computed<EditableSegment[]>(() =>
    this.editableEntries().flatMap((entry) => {
      const points = this.toViewportPoints(entry.points);
      const segments: EditableSegment[] = [];

      for (let index = 0; index < points.length - 1; index++) {
        const start = points[index];
        const end = points[index + 1];
        segments.push({
          key: `${entry.key}-segment-${index}`,
          mode: entry.mode,
          shape: entry.shape,
          featureIndex: entry.featureIndex,
          insertIndex: index,
          path: `M${start.x.toFixed(1)} ${start.y.toFixed(1)} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
        });
      }

      if (
        entry.shape === "polygon" &&
        points.length >= 3 &&
        !sameSource(this.currentDrawingSource(), entry)
      ) {
        const start = points[points.length - 1];
        const end = points[0];
        segments.push({
          key: `${entry.key}-segment-close`,
          mode: entry.mode,
          shape: entry.shape,
          featureIndex: entry.featureIndex,
          insertIndex: points.length - 1,
          path: `M${start.x.toFixed(1)} ${start.y.toFixed(1)} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
        });
      }

      return segments;
    }),
  );

  protected readonly hasVectorOverlays = computed(
    () =>
      this.polylines().length > 0 ||
      this.polygons().length > 0 ||
      this.renderedEditableShapes().length > 0,
  );

  protected readonly svgViewBox = computed(
    () => `0 0 ${this.containerSize().width} ${this.containerSize().height}`,
  );

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.destroyRef.onDestroy(() => {
      this.removeWindowDragListeners();
      this.inputSyncEffect.destroy();
      this.drawModeEffect.destroy();
    });
  }

  protected onWheel(event: WheelEvent): void {
    if (!this.isInteractive()) return;
    event.preventDefault();
    this.setZoom(this.activeZoom() + (event.deltaY < 0 ? 1 : -1));
  }

  protected onMouseDown(event: MouseEvent): void {
    if (
      !this.isInteractive() ||
      event.button !== 0 ||
      this.drawMode() !== "none"
    ) {
      return;
    }

    event.preventDefault();
    const center = this.activeCenter();
    const zoom = this.activeZoom();
    const centerPx = latLngToPixel(center.lat, center.lng, zoom);

    this.mapDragState = {
      startX: event.clientX,
      startY: event.clientY,
      centerX: centerPx.x,
      centerY: centerPx.y,
      zoom,
    };

    this.selectedVertex.set(null);
    this.isDragging.set(true);
    this.addWindowDragListeners();
  }

  protected onViewportClick(event: MouseEvent): void {
    if (!this.isInteractive()) return;
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }

    const shape = drawModeToShape(this.drawMode());
    if (event.detail > 1 || !shape) return;

    const position = latLngToGeoJsonPosition(
      this.eventToLatLng(event.clientX, event.clientY),
    );
    this.draftHoverPosition.set(position);
    this.appendDrawPoint(shape, position);
  }

  protected onDoubleClick(event: MouseEvent): void {
    if (!this.isInteractive()) return;
    event.preventDefault();
    this.draftHoverPosition.set(
      latLngToGeoJsonPosition(this.eventToLatLng(event.clientX, event.clientY)),
    );
    this.currentDrawingSource.set(null);
    this.draftHoverPosition.set(null);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isInteractive()) return;

    if (event.key === "Escape") {
      if (this.currentDrawingSource()) {
        event.preventDefault();
        this.currentDrawingSource.set(null);
        this.draftHoverPosition.set(null);
      }
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      const selected = this.selectedVertex();
      if (selected) {
        event.preventDefault();
        this.deleteVertex(selected);
      }
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      this.setZoom(this.activeZoom() + 1);
      return;
    }

    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      this.setZoom(this.activeZoom() - 1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.panByPixels(-KEYBOARD_PAN_STEP_PX, 0);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.panByPixels(KEYBOARD_PAN_STEP_PX, 0);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.panByPixels(0, -KEYBOARD_PAN_STEP_PX);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.panByPixels(0, KEYBOARD_PAN_STEP_PX);
    }
  }

  protected onVertexMouseDown(event: MouseEvent, handle: EditableHandle): void {
    if (!this.isInteractive() || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const nextSelection: EditableVertexRef = {
      mode: handle.mode,
      shape: handle.shape,
      featureIndex: handle.featureIndex,
      index: handle.index,
    };

    this.selectedVertex.set(nextSelection);
    this.vertexDragState = nextSelection;
    this.isDragging.set(true);
    this.addWindowDragListeners();
  }

  protected onVertexDoubleClick(
    event: MouseEvent,
    handle: EditableHandle,
  ): void {
    if (!this.isInteractive()) return;
    event.preventDefault();
    event.stopPropagation();
    this.deleteVertex({
      mode: handle.mode,
      shape: handle.shape,
      featureIndex: handle.featureIndex,
      index: handle.index,
    });
  }

  protected onSegmentClick(event: MouseEvent, segment: EditableSegment): void {
    if (!this.isInteractive()) return;
    event.preventDefault();
    event.stopPropagation();

    const point = latLngToGeoJsonPosition(
      this.eventToLatLng(event.clientX, event.clientY),
    );

    this.insertVertex(
      {
        mode: segment.mode,
        shape: segment.shape,
        featureIndex: segment.featureIndex,
      },
      segment.insertIndex,
      point,
    );
  }

  private setupResizeObserver(): void {
    const element = this.elRef.nativeElement;

    const measure = () => {
      const { width: viewportWidth, height: viewportHeight } =
        element.getBoundingClientRect();
      this.containerSize.set({
        width: Math.round(viewportWidth),
        height: Math.round(viewportHeight),
      });
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(element);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.vertexDragState) {
      this.suppressNextClick = true;
      this.updateVertex(
        this.vertexDragState,
        latLngToGeoJsonPosition(
          this.eventToLatLng(event.clientX, event.clientY),
        ),
      );
      return;
    }

    if (this.currentDrawingSource()) {
      this.draftHoverPosition.set(
        latLngToGeoJsonPosition(
          this.eventToLatLng(event.clientX, event.clientY),
        ),
      );
    }

    if (!this.mapDragState) return;

    this.suppressNextClick = true;
    const dx = event.clientX - this.mapDragState.startX;
    const dy = event.clientY - this.mapDragState.startY;
    const center = pixelToLatLng(
      this.mapDragState.centerX - dx,
      this.mapDragState.centerY - dy,
      this.mapDragState.zoom,
    );

    this.currentCenter.set(center);
    this.centerChange.emit(center);
  }

  private stopDrag(): void {
    if (!this.mapDragState && !this.vertexDragState) return;
    this.mapDragState = null;
    this.vertexDragState = null;
    this.isDragging.set(false);
    this.removeWindowDragListeners();
  }

  private setZoom(nextZoom: number): void {
    const zoom = clampZoom(nextZoom);
    if (zoom === this.activeZoom()) return;
    this.currentZoom.set(zoom);
    this.zoomChange.emit(zoom);
  }

  private panByPixels(dx: number, dy: number): void {
    const center = this.activeCenter();
    const zoom = this.activeZoom();
    const centerPx = latLngToPixel(center.lat, center.lng, zoom);
    const next = pixelToLatLng(centerPx.x + dx, centerPx.y + dy, zoom);
    this.currentCenter.set(next);
    this.centerChange.emit(next);
  }

  private addWindowDragListeners(): void {
    window.addEventListener("mousemove", this.onWindowMouseMove);
    window.addEventListener("mouseup", this.onWindowMouseUp);
  }

  private removeWindowDragListeners(): void {
    window.removeEventListener("mousemove", this.onWindowMouseMove);
    window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private appendDrawPoint(
    shape: "line" | "polygon",
    point: MapViewGeoJsonPosition,
  ): void {
    const current = this.currentDrawingSource();
    if (!current || current.shape !== shape) {
      this.draftHoverPosition.set(point);
      this.currentDrawingSource.set(this.createEditableSource(shape, point));
      return;
    }

    this.draftHoverPosition.set(point);
    this.appendPointToSource(current, point);
  }

  private createEditableSource(
    shape: "line" | "polygon",
    point: MapViewGeoJsonPosition,
  ): EditableSource {
    if (this.isFeatureCollectionMode()) {
      const collection = this.geoJsonFeatureCollection() ?? {
        type: "FeatureCollection",
        features: [],
      };
      const feature: MapViewGeoJsonFeature = {
        type: "Feature",
        geometry:
          shape === "line"
            ? { type: "LineString", coordinates: [point] }
            : { type: "Polygon", coordinates: [closePolygonRing([point])] },
        properties: null,
      };
      const featureIndex = collection.features.length;
      this.geoJsonFeatureCollection.set({
        ...collection,
        features: [...collection.features, feature],
      });
      return { mode: "feature", shape, featureIndex };
    }

    if (shape === "line") {
      this.geoJsonLine.set({ type: "LineString", coordinates: [point] });
      return { mode: "legacy", shape: "line" };
    }

    this.geoJsonPolygon.set({
      type: "Polygon",
      coordinates: [closePolygonRing([point])],
    });
    return { mode: "legacy", shape: "polygon" };
  }

  private appendPointToSource(
    source: EditableSource,
    point: MapViewGeoJsonPosition,
  ): void {
    if (source.shape === "line") {
      this.updateLineCoordinates(source, (coordinates) => [
        ...coordinates,
        point,
      ]);
      return;
    }

    this.updatePolygonRing(source, (ring) => [...ring, point]);
  }

  private insertVertex(
    source: EditableSource,
    insertIndex: number,
    point: MapViewGeoJsonPosition,
  ): void {
    if (source.shape === "line") {
      this.updateLineCoordinates(source, (coordinates) => {
        const next = [...coordinates];
        next.splice(insertIndex + 1, 0, point);
        return next;
      });
      return;
    }

    this.updatePolygonRing(source, (ring) => {
      const next = [...ring];
      next.splice(insertIndex + 1, 0, point);
      return next;
    });
  }

  private updateVertex(
    vertex: EditableVertexRef,
    point: MapViewGeoJsonPosition,
  ): void {
    if (vertex.shape === "line") {
      this.updateLineCoordinates(vertex, (coordinates) => {
        const next = [...coordinates];
        next[vertex.index] = point;
        return next;
      });
      return;
    }

    this.updatePolygonRing(vertex, (ring) => {
      const next = [...ring];
      next[vertex.index] = point;
      return next;
    });
  }

  private deleteVertex(vertex: EditableVertexRef): void {
    if (vertex.shape === "line") {
      this.updateLineCoordinates(vertex, (coordinates) => {
        const next = [...coordinates];
        next.splice(vertex.index, 1);
        return next;
      });
      return;
    }

    this.updatePolygonRing(vertex, (ring) => {
      const next = [...ring];
      next.splice(vertex.index, 1);
      return next;
    });
  }

  private updateLineCoordinates(
    source: EditableSource,
    updater: (
      coordinates: MapViewGeoJsonPosition[],
    ) => MapViewGeoJsonPosition[],
  ): void {
    if (source.mode === "legacy") {
      const line = this.geoJsonLine();
      if (!line) return;
      const coordinates = updater([...line.coordinates]);
      this.geoJsonLine.set(
        coordinates.length > 0 ? { ...line, coordinates } : null,
      );
      this.clearInvalidSelections(source, coordinates.length > 0);
      return;
    }

    this.updateFeatureGeometry(
      source.featureIndex ?? -1,
      (geometry) => {
        if (geometry.type !== "LineString") return geometry;
        const coordinates = updater([...geometry.coordinates]);
        return coordinates.length > 0 ? { ...geometry, coordinates } : null;
      },
      source,
    );
  }

  private updatePolygonRing(
    source: EditableSource,
    updater: (ring: MapViewGeoJsonPosition[]) => MapViewGeoJsonPosition[],
  ): void {
    if (source.mode === "legacy") {
      const polygon = this.geoJsonPolygon();
      if (!polygon) return;
      const ring = updater(openPolygonRing(polygon.coordinates[0] ?? []));
      this.geoJsonPolygon.set(
        ring.length > 0
          ? {
              ...polygon,
              coordinates: [
                closePolygonRing(ring),
                ...polygon.coordinates.slice(1),
              ],
            }
          : null,
      );
      this.clearInvalidSelections(source, ring.length > 0);
      return;
    }

    this.updateFeatureGeometry(
      source.featureIndex ?? -1,
      (geometry) => {
        if (geometry.type !== "Polygon") return geometry;
        const ring = updater(openPolygonRing(geometry.coordinates[0] ?? []));
        return ring.length > 0
          ? {
              ...geometry,
              coordinates: [
                closePolygonRing(ring),
                ...geometry.coordinates.slice(1),
              ],
            }
          : null;
      },
      source,
    );
  }

  private updateFeatureGeometry(
    featureIndex: number,
    updater: (
      geometry: MapViewGeoJsonGeometry,
    ) => MapViewGeoJsonGeometry | null,
    source: EditableSource,
  ): void {
    const collection = this.geoJsonFeatureCollection();
    if (
      !collection ||
      featureIndex < 0 ||
      featureIndex >= collection.features.length
    ) {
      return;
    }

    const features = [...collection.features];
    const feature = features[featureIndex];
    const geometry = updater(feature.geometry);

    if (geometry) {
      features[featureIndex] = { ...feature, geometry };
      this.geoJsonFeatureCollection.set({ ...collection, features });
      return;
    }

    features.splice(featureIndex, 1);
    this.geoJsonFeatureCollection.set({ ...collection, features });
    this.selectedVertex.set(null);
    if (sameSource(this.currentDrawingSource(), source)) {
      this.currentDrawingSource.set(null);
      this.draftHoverPosition.set(null);
    }
  }

  private clearInvalidSelections(
    source: EditableSource,
    stillExists: boolean,
  ): void {
    if (!stillExists) {
      this.selectedVertex.set(null);
      if (sameSource(this.currentDrawingSource(), source)) {
        this.currentDrawingSource.set(null);
        this.draftHoverPosition.set(null);
      }
    }
  }

  private toViewportPoints(
    points: readonly MapLatLng[],
  ): { x: number; y: number }[] {
    const { width: viewportWidth, height: viewportHeight } =
      this.containerSize();
    if (viewportWidth === 0 || viewportHeight === 0) return [];

    const center = this.activeCenter();
    const zoom = this.activeZoom();
    return points.map((point) =>
      latLngToViewport(
        point.lat,
        point.lng,
        zoom,
        center.lat,
        center.lng,
        viewportWidth,
        viewportHeight,
      ),
    );
  }

  private eventToLatLng(clientX: number, clientY: number): MapLatLng {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    const center = this.activeCenter();
    return viewportToLatLng(
      clientX - rect.left,
      clientY - rect.top,
      this.activeZoom(),
      center.lat,
      center.lng,
      this.containerSize().width,
      this.containerSize().height,
    );
  }
}
