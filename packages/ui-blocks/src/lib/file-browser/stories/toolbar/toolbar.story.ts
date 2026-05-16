import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { FileBrowserViewMode } from "../../file-browser.types";
import { UIFileBrowser } from "../../file-browser.component";
import {
  UIFileBrowserStoryBase,
  fileBrowserMetadataProvider,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-toolbar-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./toolbar.story.scss",
  templateUrl: "./toolbar.story.html",
})
export class ToolbarDemo extends UIFileBrowserStoryBase {
  protected readonly metadataProvider = fileBrowserMetadataProvider;

  protected readonly currentViewMode = signal<FileBrowserViewMode>("list");

  protected readonly detailsOpen = signal(false);
}
