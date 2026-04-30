import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import { UIFileBrowserStoryBase } from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-no-sidebar-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./no-sidebar.story.scss",
  templateUrl: "./no-sidebar.story.html",
})
export class NoSidebarDemo extends UIFileBrowserStoryBase {}
