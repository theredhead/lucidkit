import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileUpload, type UIFileEntry } from "../../file-upload.component";

// ── Demo wrappers ──────────────────────────────────────────────────

@Component({
  selector: "ui-file-upload-default-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly log = signal<string[]>([]);

  protected onAdded(entry: UIFileEntry): void {
    this.log.update((l) => [...l, `+ Added: ${entry.file.name}`]);
  }

  protected onRemoved(entry: UIFileEntry): void {
    this.log.update((l) => [...l, `- Removed: ${entry.file.name}`]);
  }
}
