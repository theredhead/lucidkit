import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UIToolbar } from "../../toolbar.component";
import { UIButtonGroupTool } from "../../tools/button-group-tool/button-group-tool.component";
import { UIButtonTool } from "../../tools/button-tool/button-tool.component";
import { UISeparatorTool } from "../../tools/separator-tool/separator-tool.component";

@Component({
  selector: "ui-button-groups-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIButtonGroupTool, UIButtonTool, UISeparatorTool],
  templateUrl: "./button-groups.story.html",
  styleUrl: "./button-groups.story.scss",
})
export class ButtonGroupsStorySource {
  protected readonly UIIcons = UIIcons;

  public onAction(_event: unknown): void {}
}
