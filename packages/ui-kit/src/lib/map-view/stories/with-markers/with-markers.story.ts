import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng, MapMarker } from "../../map-view.model";

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

@Component({
  selector: "ui-map-view-markers-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./with-markers.story.html",
})
export class MapViewMarkersDemo {
  readonly zoom = input(5);
  readonly width = input<string | undefined>(undefined);
  readonly height = input("500px");
  readonly ariaLabel = input("European cities");
  readonly center = EUROPE_CENTER;
  readonly markers = CITY_MARKERS;
}
