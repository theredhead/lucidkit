import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { UIButton } from "@theredhead/lucid-kit";

import type {
  FileBrowserDatasource,
  FileBrowserEntry,
} from "../../../file-browser/file-browser.types";
import { CommonDialogService } from "../../common-dialog.service";

interface FileMeta {
  readonly size?: string;
}

function mkDir(id: string, name: string): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: true };
}

function mkFile(
  id: string,
  name: string,
  meta?: FileMeta,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: false, meta };
}

const FILE_TREE: Record<string, FileBrowserEntry<FileMeta>[]> = {
  root: [
    mkDir("docs", "Documents"),
    mkDir("images", "Images"),
    mkFile("readme", "README.md", { size: "4.2 KB" }),
    mkFile("notes", "notes.txt", { size: "1.1 KB" }),
  ],
  docs: [
    mkFile("report", "report.pdf", { size: "2.4 MB" }),
    mkFile("slides", "presentation.pptx", { size: "8.1 MB" }),
  ],
  images: [
    mkFile("logo", "logo.svg", { size: "3.2 KB" }),
    mkFile("photo", "photo.jpg", { size: "1.5 MB" }),
  ],
};

class DemoDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    return FILE_TREE[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  private readonly dialogs = inject(CommonDialogService);
  private readonly datasource = new DemoDatasource();

  public async showAlert(): Promise<void> {
    await this.dialogs.alert({
      title: "Update Available",
      message:
        "A new version of the application is available.\nPlease restart to apply the update.",
    });
  }

  public async showConfirm(
    variant: "primary" | "danger" | "warning" = "primary",
  ): Promise<void> {
    await this.dialogs.confirm({
      title:
        variant === "danger"
          ? "Delete Project?"
          : variant === "warning"
            ? "Unsaved Changes"
            : "Confirm Action",
      message:
        variant === "danger"
          ? "This will permanently delete the project and all its data.\nThis action cannot be undone."
          : variant === "warning"
            ? "You have unsaved changes. Do you want to discard them?"
            : "Are you sure you want to proceed?",
      variant,
      confirmLabel: variant === "danger" ? "Delete" : "OK",
    });
  }

  public async showPrompt(): Promise<void> {
    await this.dialogs.prompt({
      title: "Rename File",
      message: "Enter a new name for this file:",
      defaultValue: "document.txt",
      placeholder: "file name",
    });
  }

  public async showOpenFile(): Promise<void> {
    await this.dialogs.openFile({
      datasource: this.datasource,
    });
  }

  public async showSaveFile(): Promise<void> {
    await this.dialogs.saveFile({
      datasource: this.datasource,
      defaultName: "untitled.txt",
    });
  }

  public async showAbout(): Promise<void> {
    await this.dialogs.about({
      appName: "ConnectHub",
      version: "3.2.1",
      description:
        "A unified communication and collaboration platform for modern teams.",
      copyright: "\u00a9 2026 Acme Corporation",
      credits: ["Angular Team", "Lucide Icons", "@theredhead UI Library"],
    });
  }
}
