import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIIcon } from "../../../icon/icon.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";
import {
  UIDropdownDivider,
  UIDropdownItem,
  UIDropdownMenu,
} from "../../dropdown-menu.component";

@Component({
  selector: "ui-with-icons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UIDropdownMenu,
    UIButton,
    UIDropdownItem,
    UIDropdownDivider,
    UIIcon,
  ],
  templateUrl: "./with-icons.story.html",
  styleUrl: "./with-icons.story.scss",
})
export class WithIconsStorySource {
  protected readonly icons = {
    new: UIIcons.Lucide.Files.FilePlus,
    open: UIIcons.Lucide.Files.FolderOpen,
    save: UIIcons.Lucide.Files.Save,
    print: UIIcons.Lucide.Devices.Printer,
    export: UIIcons.Lucide.Files.FileOutput,
  } as const;
}
