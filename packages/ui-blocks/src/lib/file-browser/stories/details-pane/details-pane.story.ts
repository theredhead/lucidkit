import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import {
  UIFileBrowserStoryBase,
  fileBrowserMetadataProvider,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-details-pane-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./details-pane.story.scss",
  templateUrl: "./details-pane.story.html",
})
export class DetailsPaneDemo extends UIFileBrowserStoryBase {
  protected readonly metadataProvider = fileBrowserMetadataProvider;
}
