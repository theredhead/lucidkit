import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UIToolbar } from "../../toolbar.component";
import { UISeparatorTool } from "../../tools/separator-tool/separator-tool.component";
import { UIToggleGroupTool } from "../../tools/toggle-group-tool/toggle-group-tool.component";
import { UIToggleTool } from "../../tools/toggle-tool/toggle-tool.component";

@Component({
  selector: "ui-toggle-tools-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIToggleTool, UISeparatorTool, UIToggleGroupTool],
  templateUrl: "./toggle-tools.story.html",
  styleUrl: "./toggle-tools.story.scss",
})
export class ToggleToolsStorySource {
  protected readonly UIIcons = UIIcons;

  public isBold = false;
  public isItalic = false;

  public onAction(_event: unknown): void {}
}
