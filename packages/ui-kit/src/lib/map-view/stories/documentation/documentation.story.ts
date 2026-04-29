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

// ── Story components ──────────────────────────────────────────────────

@Component({
  selector: "ui-map-view-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./documentation.story.html",
})
export class MapViewBasicDemo {
  readonly center = AMSTERDAM;
}
