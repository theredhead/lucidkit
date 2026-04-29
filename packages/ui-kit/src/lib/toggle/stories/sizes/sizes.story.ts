import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UIToggle } from "../../toggle.component";

// ── Demo wrapper: Sizes ──────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-sizes",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sizes.story.html",
})
export class DemoToggleSizes {
  protected readonly sm = signal(true);
  protected readonly md = signal(true);
  protected readonly lg = signal(true);
}
