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

const ROUTE_AMS_PAR_HIGHLIGHTED: MapPolyline = {
  ...ROUTE_AMS_PAR,
  highlighted: true,
  highlightColor: "#ffd700",
  highlightWidth: 5,
};

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

const BENELUX_HIGHLIGHTED: MapPolygon = {
  ...BENELUX_POLYGON,
  highlighted: true,
  highlightFillColor: "#e5a00d",
  highlightFillOpacity: 0.3,
  highlightStrokeColor: "#e5a00d",
  highlightStrokeWidth: 3,
};

@Component({
  selector: "ui-map-view-highlight-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./highlight-comparison.story.html",
})
export class MapViewHighlightDemo {
  readonly center: MapLatLng = { lat: 51.0, lng: 4.5 };
  readonly markers: MapMarker[] = [
    { position: AMSTERDAM, label: "Amsterdam" },
    { position: BRUSSELS, label: "Brussels" },
    { position: PARIS, label: "Paris" },
  ];
  readonly route = ROUTE_AMS_PAR;
  readonly routeHighlighted = ROUTE_AMS_PAR_HIGHLIGHTED;
  readonly polygon = BENELUX_POLYGON;
  readonly polygonHighlighted = BENELUX_HIGHLIGHTED;
}
