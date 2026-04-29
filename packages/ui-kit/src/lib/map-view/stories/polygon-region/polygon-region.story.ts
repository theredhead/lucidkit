import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng, MapMarker, MapPolygon } from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

const BRUSSELS: MapLatLng = { lat: 50.8503, lng: 4.3517 };

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

@Component({
  selector: "ui-map-view-polygon-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./polygon-region.story.html",
})
export class MapViewPolygonDemo {
  readonly center: MapLatLng = { lat: 51.5, lng: 5.0 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: { lat: 49.6117, lng: 6.1319 }, label: "Luxembourg" },
  ];
  readonly polygons = [BENELUX_POLYGON];
}
