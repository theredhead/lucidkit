import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { type ToggleSize, UIToggle } from "../../toggle.component";

// ── Demo wrapper: Default ────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-default",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class DemoToggleDefault {
  protected readonly basic = signal(false);
  protected readonly dark = signal(true);
  protected readonly notify = signal(false);
}
