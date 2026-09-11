import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { UIJsonView } from "../../../json-view/json-view.component";
import { UIMapView } from "../../map-view.component";
import type {
  MapLatLng,
  MapViewDrawMode,
  MapViewGeoJsonFeatureCollection,
  MapViewGeoJsonPolygon,
} from "../../map-view.model";
import { buildCenteredTrianglePolygon } from "../../map-view.utils";

@Component({
  selector: "ui-map-view-geojson-editor-story",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView, UIButton, UIJsonView],
  templateUrl: "./geojson-editor.story.html",
  styleUrl: "./geojson-editor.story.scss",
})
export class MapViewGeoJsonEditorStory {
  readonly center = signal<MapLatLng>({ lat: 52.3676, lng: 4.9041 });
  readonly zoom = signal(11);
  readonly drawMode = signal<MapViewDrawMode>("none");
  readonly featureCollection = signal<MapViewGeoJsonFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  readonly featureCount = computed(
    () => this.featureCollection().features.length,
  );

  readonly jsonSnapshot = computed(() => this.featureCollection());

  startLine(): void {
    this.drawMode.set("line");
  }

  startPolygon(): void {
    this.seedTriangle();
  }

  stopDrawing(): void {
    this.drawMode.set("none");
  }

  clearAll(): void {
    this.featureCollection.set({ type: "FeatureCollection", features: [] });
    this.drawMode.set("none");
  }

  seedTriangle(): void {
    const triangle: MapViewGeoJsonPolygon = buildCenteredTrianglePolygon(
      this.center(),
      this.zoom(),
      60,
    );
    this.featureCollection.update((value) => ({
      ...value,
      features: [
        ...value.features,
        {
          type: "Feature",
          geometry: triangle,
          properties: { source: "seeded-triangle" },
        },
      ],
    }));
    this.drawMode.set("none");
  }

  onCenterChange(next: MapLatLng): void {
    this.center.set(next);
  }

  onZoomChange(next: number): void {
    this.zoom.set(next);
  }
}
