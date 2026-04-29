import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng, MapMarker } from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

const PARIS: MapLatLng = { lat: 48.8566, lng: 2.3522 };

const LONDON: MapLatLng = { lat: 51.5074, lng: -0.1278 };

const BERLIN: MapLatLng = { lat: 52.52, lng: 13.405 };

const ROME: MapLatLng = { lat: 41.9028, lng: 12.4964 };

const EUROPE_CENTER: MapLatLng = { lat: 50.0, lng: 8.0 };

const STAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" fill="#e5a00d" stroke="#b87f00" stroke-width="0.5"/>
</svg>`;

const FLAG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28">
  <line x1="3" y1="2" x2="3" y2="26" stroke="#444" stroke-width="1.5"/>
  <path d="M3 2h14l-4 5 4 5H3z" fill="#e04040" stroke="#b03030" stroke-width="0.5"/>
</svg>`;

@Component({
  selector: "ui-map-view-custom-icons-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./custom-marker-icons.story.html",
})
export class MapViewCustomIconsDemo {
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
