import { ChangeDetectionStrategy, Component } from "@angular/core";

import type { SelectOption } from "../../../dropdown-list";
import { UIToolbar } from "../../toolbar.component";
import { UIDropdownTool } from "../../tools/dropdown-tool/dropdown-tool.component";
import { UISelectTool } from "../../tools/select-tool/select-tool.component";

@Component({
  selector: "ui-dropdown-and-select-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar, UIDropdownTool, UISelectTool],
  templateUrl: "./dropdown-and-select.story.html",
  styleUrl: "./dropdown-and-select.story.scss",
})
export class DropdownAndSelectStorySource {
  public readonly fontSizeOptions: SelectOption[] = [
    { label: "12 px", value: "12" },
    { label: "14 px", value: "14" },
    { label: "16 px", value: "16" },
  ];

  public fontSize = "14";

  public onAction(_event: unknown): void {}
}
