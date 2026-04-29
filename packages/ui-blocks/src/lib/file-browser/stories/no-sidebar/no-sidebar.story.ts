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
  selector: "ui-no-sidebar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./no-sidebar.story.html",
  styleUrl: "./no-sidebar.story.scss",
})
export class NoSidebarStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/file-browser/file-browser.stories.ts.
}
