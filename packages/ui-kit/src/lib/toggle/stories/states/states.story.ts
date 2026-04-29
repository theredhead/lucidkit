import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { type ToggleSize, UIToggle } from "../../toggle.component";

// ── Demo wrapper: States ─────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-states",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./states.story.html",
})
export class DemoToggleStates {
  protected readonly enabled = signal(true);
}
