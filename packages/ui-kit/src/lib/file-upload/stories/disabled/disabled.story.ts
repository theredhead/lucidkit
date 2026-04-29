import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIFileUpload } from "../../file-upload.component";

@Component({
  selector: "ui-file-upload-disabled-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledDemo {}
