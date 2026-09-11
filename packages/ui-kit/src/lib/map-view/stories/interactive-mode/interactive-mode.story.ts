import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type {
  MapLatLng,
  MapMarker,
  MapViewInteractionMode,
} from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

const BRUSSELS: MapLatLng = { lat: 50.8503, lng: 4.3517 };

const PARIS: MapLatLng = { lat: 48.8566, lng: 2.3522 };

const BERLIN: MapLatLng = { lat: 52.52, lng: 13.405 };

const CITIES: MapMarker[] = [
  { position: AMSTERDAM, label: "Amsterdam" },
  { position: BRUSSELS, label: "Brussels" },
  { position: PARIS, label: "Paris" },
  { position: BERLIN, label: "Berlin" },
];

@Component({
  selector: "ui-map-view-interactive-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./interactive-mode.story.html",
  styleUrl: "./interactive-mode.story.scss",
})
export class MapViewInteractiveDemo {
  readonly width = input("100%");
  readonly height = input("560px");
  readonly ariaLabel = input("Interactive Europe map");
  readonly interactionMode = input<MapViewInteractionMode>("interactive");

  readonly markers = CITIES;

  readonly center = signal<MapLatLng>({ lat: 51.3, lng: 6.5 });
  readonly zoom = signal(5);

  onCenterChange(next: MapLatLng): void {
    this.center.set(next);
  }

  onZoomChange(next: number): void {
    this.zoom.set(next);
  }
}
