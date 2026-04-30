import { ChangeDetectionStrategy, Component } from "@angular/core";

import type { FileActivateEvent } from "../../file-browser.types";
import { UIFileBrowser } from "../../file-browser.component";
import {
  type FileMeta,
  UIFileBrowserStoryBase,
} from "../file-browser-story.helpers";

@Component({
  selector: "ui-file-browser-custom-template-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./custom-template.story.scss",
  templateUrl: "./custom-template.story.html",
})
export class CustomTemplateDemo extends UIFileBrowserStoryBase {
  protected override onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name} (${event.entry.meta?.type ?? "unknown"})`);
  }
}
