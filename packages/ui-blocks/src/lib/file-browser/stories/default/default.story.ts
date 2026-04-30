import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import { UIFileBrowserStoryBase } from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-default-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./default.story.scss",
  templateUrl: "./default.story.html",
})
export class DefaultDemo extends UIFileBrowserStoryBase {}
