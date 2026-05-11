import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { DropdownToolItem } from "../../toolbar-action";
import type { SelectOption } from "../../../dropdown-list";
import { UIIcons } from "../../../icon/lucide-icons.generated";
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
  protected readonly insertItems: DropdownToolItem[] = [
    { id: "table", label: "Table", icon: UIIcons.Lucide.Text.Table },
    { id: "image", label: "Image", icon: UIIcons.Lucide.Text.Image },
    { id: "link", label: "Link", icon: UIIcons.Lucide.Text.Link },
    { id: "code", label: "Code block", icon: UIIcons.Lucide.Text.Code },
    { id: "list", label: "List", icon: UIIcons.Lucide.Text.List },
    { id: "quote", label: "Quote", icon: UIIcons.Lucide.Text.Quote },
    { id: "heading", label: "Heading", icon: UIIcons.Lucide.Text.Heading },
  ];

  protected readonly fontSizeOptions: SelectOption[] = [
    { label: "12 px", value: "12" },
    { label: "14 px", value: "14" },
    { label: "16 px", value: "16" },
    { label: "18 px", value: "18" },
    { label: "24 px", value: "24" },
  ];

  protected readonly fontSize = signal("14");
}
