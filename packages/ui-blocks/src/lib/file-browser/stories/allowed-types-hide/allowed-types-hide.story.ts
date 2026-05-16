import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileBrowser } from "../../file-browser.component";
import type {
  AllowedFileTypes,
  DirectoryChangeEvent,
  FileActivateEvent,
  FileBrowserDatasource,
  FileBrowserEntry,
} from "../../file-browser.types";
import { parseAllowedTypes } from "../../file-browser.types";

// ── Local sample dataset with mimeType set ────────────────────────────────────

interface MediaMeta {
  size?: string;
  modified?: string;
}

const MEDIA_ENTRIES: Record<string, FileBrowserEntry<MediaMeta>[]> = {
  root: [
    { id: "images", name: "images", isDirectory: true },
    { id: "documents", name: "documents", isDirectory: true },
    { id: "source", name: "source", isDirectory: true },
    {
      id: "hero",
      name: "hero.png",
      isDirectory: false,
      mimeType: "image/png",
      meta: { size: "142 KB", modified: "2026-04-12" },
    },
    {
      id: "logo",
      name: "logo.svg",
      isDirectory: false,
      mimeType: "image/svg+xml",
      meta: { size: "3 KB", modified: "2026-03-15" },
    },
    {
      id: "config",
      name: "app.config.json",
      isDirectory: false,
      mimeType: "application/json",
      meta: { size: "1 KB", modified: "2026-04-28" },
    },
    {
      id: "readme",
      name: "README.md",
      isDirectory: false,
      mimeType: "text/markdown",
      meta: { size: "4 KB", modified: "2026-04-20" },
    },
  ],
  images: [
    {
      id: "img-banner",
      name: "banner.png",
      isDirectory: false,
      mimeType: "image/png",
      meta: { size: "320 KB", modified: "2026-04-10" },
    },
    {
      id: "img-avatar",
      name: "avatar.jpg",
      isDirectory: false,
      mimeType: "image/jpeg",
      meta: { size: "22 KB", modified: "2026-04-05" },
    },
    {
      id: "img-thumbnail",
      name: "thumbnail.webp",
      isDirectory: false,
      mimeType: "image/webp",
      meta: { size: "14 KB", modified: "2026-04-08" },
    },
    {
      id: "img-icon",
      name: "icon.svg",
      isDirectory: false,
      mimeType: "image/svg+xml",
      meta: { size: "2 KB", modified: "2026-03-20" },
    },
    {
      id: "img-video",
      name: "demo.mp4",
      isDirectory: false,
      mimeType: "video/mp4",
      meta: { size: "8.4 MB", modified: "2026-04-01" },
    },
    {
      id: "img-data",
      name: "metadata.json",
      isDirectory: false,
      mimeType: "application/json",
      meta: { size: "1 KB", modified: "2026-04-08" },
    },
  ],
  documents: [
    {
      id: "doc-spec",
      name: "spec.pdf",
      isDirectory: false,
      mimeType: "application/pdf",
      meta: { size: "460 KB", modified: "2026-04-22" },
    },
    {
      id: "doc-design",
      name: "design-brief.docx",
      isDirectory: false,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      meta: { size: "128 KB", modified: "2026-04-18" },
    },
    {
      id: "doc-notes",
      name: "meeting-notes.md",
      isDirectory: false,
      mimeType: "text/markdown",
      meta: { size: "6 KB", modified: "2026-04-25" },
    },
    {
      id: "doc-cover",
      name: "cover.png",
      isDirectory: false,
      mimeType: "image/png",
      meta: { size: "88 KB", modified: "2026-04-18" },
    },
  ],
  source: [
    {
      id: "src-main",
      name: "main.ts",
      isDirectory: false,
      mimeType: "text/typescript",
      meta: { size: "1 KB", modified: "2026-04-28" },
    },
    {
      id: "src-styles",
      name: "styles.scss",
      isDirectory: false,
      mimeType: "text/css",
      meta: { size: "2 KB", modified: "2026-04-27" },
    },
    {
      id: "src-index",
      name: "index.html",
      isDirectory: false,
      mimeType: "text/html",
      meta: { size: "1 KB", modified: "2026-04-01" },
    },
    {
      id: "src-splash",
      name: "splash.png",
      isDirectory: false,
      mimeType: "image/png",
      meta: { size: "56 KB", modified: "2026-04-15" },
    },
  ],
};

class MediaFileBrowserDatasource implements FileBrowserDatasource<MediaMeta> {
  public getChildren(
    parent: FileBrowserEntry<MediaMeta> | null,
  ): FileBrowserEntry<MediaMeta>[] {
    return MEDIA_ENTRIES[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<MediaMeta>): boolean {
    return entry.isDirectory;
  }
}

// ── Story component ───────────────────────────────────────────────────────────

@Component({
  selector: "ui-file-browser-allowed-types-hide-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./allowed-types-hide.story.scss",
  templateUrl: "./allowed-types-hide.story.html",
})
export class AllowedTypesHideDemo {
  protected readonly ds = new MediaFileBrowserDatasource();

  protected readonly allowedTypes: AllowedFileTypes =
    parseAllowedTypes("image/*");

  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<MediaMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }

  protected onDirChange(event: DirectoryChangeEvent<MediaMeta>): void {
    const path = event.path.map((e) => e.name).join("/");
    this.lastEvent.set(`Navigated to: /${path || "(root)"}`);
  }
}
