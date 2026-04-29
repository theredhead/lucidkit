import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileUpload, type UIFileEntry } from "../../file-upload.component";

@Component({
  selector: "ui-file-upload-images-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./images-only.story.html",
  styleUrl: "./images-only.story.scss",
})
export class ImagesDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly rejections = signal<string[]>([]);

  protected onRejected(event: { file: File; reason: string }): void {
    this.rejections.update((l) => [
      ...l,
      `✗ ${event.file.name}: ${event.reason}`,
    ]);
  }
}
