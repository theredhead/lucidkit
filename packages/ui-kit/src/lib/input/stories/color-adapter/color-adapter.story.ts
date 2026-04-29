import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-color-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./color-adapter.story.html",
  styleUrl: "./color-adapter.story.scss",
})
export class ColorAdapterStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/input/input.stories.ts.
}
