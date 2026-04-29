import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileUpload, type UIFileEntry } from "../../file-upload.component";

@Component({
  selector: "ui-file-upload-size-limit-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./size-limit.story.html",
  styleUrl: "./size-limit.story.scss",
})
export class SizeLimitDemo {
  protected readonly maxSize = 1024 * 1024; // 1 MB
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly rejections = signal<string[]>([]);

  protected onRejected(event: { file: File; reason: string }): void {
    this.rejections.update((l) => [
      ...l,
      `✗ ${event.file.name}: ${event.reason}`,
    ]);
  }
}
