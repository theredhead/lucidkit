import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIDensityDirective } from "../../../ui-density";
import { UIButton } from "../../../button/button.component";
import { UIMapView } from "../../map-view.component";
import type {
  MapLatLng,
  MapMarker,
  MapPolygon,
  MapPolyline,
} from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

const BRUSSELS: MapLatLng = { lat: 50.8503, lng: 4.3517 };

const PARIS: MapLatLng = { lat: 48.8566, lng: 2.3522 };

const ROUTE_AMS_PAR: MapPolyline = {
  points: [AMSTERDAM, BRUSSELS, PARIS],
  color: "#e04040",
  width: 3,
  dashArray: "8 4",
};

@Component({
  selector: "ui-map-view-route-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./route-polyline.story.html",
})
export class MapViewRouteDemo {
  readonly center: MapLatLng = { lat: 50.5, lng: 3.7 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: PARIS, label: "Paris", color: "#e04040" },
  ];
  readonly polylines = [ROUTE_AMS_PAR];
}
