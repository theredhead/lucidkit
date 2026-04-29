import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIFileUpload, type UIFileEntry } from "../../file-upload.component";

@Component({
  selector: "ui-file-upload-disabled-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledDemo {}
