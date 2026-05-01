import { signal } from "@angular/core";

import type {
  DirectoryChangeEvent,
  FileActivateEvent,
  FileBrowserDatasource,
  FileBrowserEntry,
  MetadataField,
} from "../file-browser.types";

export interface FileMeta {
  size?: string;
  modified?: string;
  type?: string;
}

const SAMPLE_ENTRIES: Record<string, FileBrowserEntry<FileMeta>[]> = {
  root: [
    createDirectory("src", "src"),
    createDirectory("docs", "docs"),
    createDirectory("tests", "tests"),
    createFile("readme", "README.md", {
      size: "4.2 KB",
      modified: "2026-04-12",
      type: "Markdown",
    }),
    createFile("package", "package.json", {
      size: "1.8 KB",
      modified: "2026-04-28",
      type: "JSON",
    }),
  ],
  src: [
    createDirectory("src-app", "app"),
    createDirectory("src-assets", "assets"),
    createFile("src-main", "main.ts", {
      size: "0.4 KB",
      modified: "2026-04-28",
      type: "TypeScript",
    }),
    createFile("src-styles", "styles.scss", {
      size: "1.1 KB",
      modified: "2026-04-28",
      type: "SCSS",
    }),
  ],
  "src-app": [
    createFile("app-component", "app.component.ts", {
      size: "2.1 KB",
      modified: "2026-04-27",
      type: "TypeScript",
    }),
    createFile("app-config", "app.config.ts", {
      size: "0.9 KB",
      modified: "2026-04-27",
      type: "TypeScript",
    }),
  ],
  docs: [
    createFile("docs-getting-started", "getting-started.md", {
      size: "8.3 KB",
      modified: "2026-04-20",
      type: "Markdown",
    }),
    createFile("docs-api", "api-reference.md", {
      size: "12.1 KB",
      modified: "2026-04-22",
      type: "Markdown",
    }),
  ],
  tests: [
    createFile("tests-unit", "file-browser.spec.ts", {
      size: "3.4 KB",
      modified: "2026-04-18",
      type: "TypeScript",
    }),
    createFile("tests-e2e", "file-browser.e2e.ts", {
      size: "5.1 KB",
      modified: "2026-04-18",
      type: "TypeScript",
    }),
  ],
};

export class SampleFileBrowserDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    return SAMPLE_ENTRIES[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

export abstract class UIFileBrowserStoryBase {
  protected readonly ds = new SampleFileBrowserDatasource();
  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }

  protected onDirChange(event: DirectoryChangeEvent<FileMeta>): void {
    const path = event.path.map((entry) => entry.name).join("/");
    this.lastEvent.set(`Navigated to: /${path || "(root)"}`);
  }
}

export function fileBrowserMetadataProvider(
  entry: FileBrowserEntry<FileMeta>,
): MetadataField[] {
  const fields: MetadataField[] = [];

  if (entry.meta?.size) {
    fields.push({ label: "Size", value: entry.meta.size });
  }

  if (entry.meta?.type) {
    fields.push({ label: "Type", value: entry.meta.type });
  }

  if (entry.meta?.modified) {
    fields.push({ label: "Modified", value: entry.meta.modified });
  }

  return fields;
}

function createDirectory(
  id: string,
  name: string,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: true, icon };
}

function createFile(
  id: string,
  name: string,
  meta?: FileMeta,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: false, meta, icon };
}
