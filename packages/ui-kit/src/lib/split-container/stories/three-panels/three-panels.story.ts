import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import type {
  SplitOrientation,
  SplitResizeEvent,
} from "../../split-container.types";
import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

@Component({
  selector: "ui-three-panels-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./three-panels.story.html",
  styleUrl: "./three-panels.story.scss",
})
export class ThreePanelsStorySource {
  public readonly orientation = input<SplitOrientation>("horizontal");

  public readonly dividerWidth = input<number>(6);

  public readonly disabled = input<boolean>(false);

  public readonly ariaLabel = input<string>("Resize panels");

  public readonly resized = output<SplitResizeEvent>();

  public onResized(event: SplitResizeEvent): void {
    this.resized.emit(event);
  }
}
