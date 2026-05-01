import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UIToolbar } from "../../toolbar.component";
import { UIButtonTool } from "../../tools/button-tool/button-tool.component";
import { UISeparatorTool } from "../../tools/separator-tool/separator-tool.component";

@Component({
  selector: "ui-basic-buttons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  templateUrl: "./basic-buttons.story.html",
  styleUrl: "./basic-buttons.story.scss",
})
export class BasicButtonsStorySource {
  protected readonly UIIcons = UIIcons;

  public onAction(_event: unknown): void {}
}
