import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIFileUpload, type UIFileEntry } from "../../file-upload.component";

@Component({
  selector: "ui-file-upload-documents-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./documents.story.html",
  styleUrl: "./documents.story.scss",
})
export class DocumentsDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
}
