import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UIToolbar } from "../../toolbar.component";
import { UIButtonTool } from "../../tools/button-tool/button-tool.component";
import { UISeparatorTool } from "../../tools/separator-tool/separator-tool.component";

@Component({
  selector: "ui-floating-toggle-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  templateUrl: "./floating-toggle.story.html",
  styleUrl: "./floating-toggle.story.scss",
})
export class FloatingToggleStorySource {
  protected readonly UIIcons = UIIcons;
  public readonly toolbarCollapsed = signal(false);
}
