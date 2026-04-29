import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-email-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./email-adapter.story.html",
  styleUrl: "./email-adapter.story.scss",
})
export class EmailAdapterStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/input/input.stories.ts.
}
