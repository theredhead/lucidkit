import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-url-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./url-adapter.story.html",
  styleUrl: "./url-adapter.story.scss",
})
export class UrlAdapterStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/input/input.stories.ts.
}
