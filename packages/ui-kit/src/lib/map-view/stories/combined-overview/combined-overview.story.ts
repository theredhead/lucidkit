import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng, MapMarker, MapPolygon, MapPolyline } from "../../map-view.model";

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
  selector: "ui-map-view-combined-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView, UIDensityDirective],
  templateUrl: "./combined-overview.story.html",
})
export class MapViewCombinedDemo {
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
