import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng } from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

// ── Story components ──────────────────────────────────────────────────

@Component({
  selector: "ui-map-view-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  templateUrl: "./basic.story.html",
})
export class MapViewBasicDemo {
  readonly center = AMSTERDAM;
}
