import { UISignature } from "../../signature.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-pressure-sensitive-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./pressure-sensitive.story.html",
  styleUrl: "./pressure-sensitive.story.scss",
})
export class PressureSensitiveStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.
}
