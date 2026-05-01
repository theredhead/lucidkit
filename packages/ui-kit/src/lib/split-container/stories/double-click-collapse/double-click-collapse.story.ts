import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";

import type {
  SplitOrientation,
  SplitResizeEvent,
} from "../../split-container.types";
import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

@Component({
  selector: "ui-double-click-collapse-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./double-click-collapse.story.html",
  styleUrl: "./double-click-collapse.story.scss",
})
export class DoubleClickCollapseStorySource {
  public readonly orientation = input<SplitOrientation>("horizontal");

  public readonly dividerWidth = input<number>(6);

  public readonly disabled = input<boolean>(false);

  public readonly ariaLabel = input<string>("Resize panels");

  public readonly resized = output<SplitResizeEvent>();

  public readonly lastResize = signal(
    "Double-click or drag the divider to emit a resize event.",
  );

  public onResized(event: SplitResizeEvent): void {
    this.lastResize.set(
      `${event.orientation}: ${event.sizes.map((size) => `${Math.round(size)}%`).join(" / ")}`,
    );
    this.resized.emit(event);
  }
}
