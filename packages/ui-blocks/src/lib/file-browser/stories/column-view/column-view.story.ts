import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import {
  UIFileBrowserStoryBase,
  fileBrowserMetadataProvider,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-column-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./column-view.story.scss",
  templateUrl: "./column-view.story.html",
})
export class ColumnViewDemo extends UIFileBrowserStoryBase {
  protected readonly metadataProvider = fileBrowserMetadataProvider;
}
