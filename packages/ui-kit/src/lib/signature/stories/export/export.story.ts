import { UISignature } from "../../signature.component";
import type { SignatureValue } from "../../signature.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-export-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./export.story.html",
  styleUrl: "./export.story.scss",
})
export class ExportStorySource {
  protected value: SignatureValue = null;
}
