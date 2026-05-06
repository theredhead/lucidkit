import { UISignature } from "../../signature.component";
import type { SignatureValue } from "../../signature.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-image-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./image-only.story.html",
  styleUrl: "./image-only.story.scss",
})
export class ImageOnlyStorySource {
  protected sig: SignatureValue = null;
}
