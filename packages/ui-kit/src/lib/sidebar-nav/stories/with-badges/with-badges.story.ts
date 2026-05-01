import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import { UISidebarItem, UISidebarNav } from "../../sidebar-nav.component";

@Component({
  selector: "ui-with-badges-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav, UISidebarItem],
  templateUrl: "./with-badges.story.html",
  styleUrl: "./with-badges.story.scss",
})
export class WithBadgesStorySource {
  public readonly collapsed = input(false);
  public readonly ariaLabel = input("Sidebar navigation");
  public readonly inboxIcon = UIIcons.Lucide.Files.Folder;
  public readonly sendIcon = UIIcons.Lucide.Files.Folder;
  public readonly penIcon = UIIcons.Lucide.Text.Pen;
  public readonly trashIcon = UIIcons.Lucide.Files.Trash;
}
