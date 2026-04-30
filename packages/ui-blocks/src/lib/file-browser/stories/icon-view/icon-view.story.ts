import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import {
  UIFileBrowserStoryBase,
  fileBrowserMetadataProvider,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-icon-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./icon-view.story.scss",
  templateUrl: "./icon-view.story.html",
})
export class IconViewDemo extends UIFileBrowserStoryBase {
  protected readonly metadataProvider = fileBrowserMetadataProvider;
}
