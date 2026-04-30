import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import {
  UIFileBrowserStoryBase,
  fileBrowserMetadataProvider,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-detail-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./detail-view.story.scss",
  templateUrl: "./detail-view.story.html",
})
export class DetailViewDemo extends UIFileBrowserStoryBase {
  protected readonly metadataProvider = fileBrowserMetadataProvider;
}
