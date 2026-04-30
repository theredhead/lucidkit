import { UIToolbar } from "../../toolbar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-template-tool-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar],
  templateUrl: "./template-tool.story.html",
  styleUrl: "./template-tool.story.scss",
})
export class TemplateToolStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toolbar/toolbar.stories.ts.
}
