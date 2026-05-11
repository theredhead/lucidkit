import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UIToolbar } from "../../toolbar.component";
import { UIButtonTool } from "../../tools/button-tool/button-tool.component";
import { UITemplateTool } from "../../tools/template-tool/template-tool.component";

@Component({
  selector: "ui-template-tool-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIButtonTool, UITemplateTool],
  templateUrl: "./template-tool.story.html",
  styleUrl: "./template-tool.story.scss",
})
export class TemplateToolStorySource {
  protected readonly UIIcons = UIIcons;
  protected readonly zoom = signal(100);

  protected zoomOut(): void {
    this.zoom.update((z) => Math.max(10, z - 10));
  }

  protected zoomIn(): void {
    this.zoom.update((z) => Math.min(500, z + 10));
  }
}
