import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UISplitContainer, UISplitPanel, SplitResizeEvent } from "@theredhead/lucid-kit";

@Component({
  selector: "app-collapse-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./collapse-demo.component.html",
})
export class CollapseSplitDemo {
  protected readonly lastResize = signal("—");

  protected onResized(event: SplitResizeEvent): void {
    this.lastResize.set(event.sizes.map((s) => s.toFixed(1) + "%").join(" / "));
  }
}
