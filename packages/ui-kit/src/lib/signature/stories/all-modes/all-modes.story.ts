import { UISignature } from "../../signature.component";
import type { SignatureValue } from "../../signature.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-modes-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./all-modes.story.html",
  styleUrl: "./all-modes.story.scss",
})
export class AllModesStorySource {
  protected sig: SignatureValue = null;
}
