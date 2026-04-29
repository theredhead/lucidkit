import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileBrowser } from "./file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
  FileActivateEvent,
  DirectoryChangeEvent,
  MetadataField,
} from "./file-browser.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-template-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./custom-template.story.html",
  styleUrl: "./custom-template.story.scss",
})
export class CustomTemplateStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/file-browser/file-browser.stories.ts.
}
