import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import { UIFileBrowserStoryBase } from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-allowed-types-dim-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./allowed-types-dim.story.scss",
  templateUrl: "./allowed-types-dim.story.html",
})
export class AllowedTypesDimDemo extends UIFileBrowserStoryBase {}
