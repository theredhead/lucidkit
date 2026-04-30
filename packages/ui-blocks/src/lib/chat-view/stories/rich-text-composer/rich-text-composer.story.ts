import { UIChatView } from "../../chat-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-rich-text-composer-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChatView],
  templateUrl: "./rich-text-composer.story.html",
  styleUrl: "./rich-text-composer.story.scss",
})
export class RichTextComposerStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/chat-view/chat-view.stories.ts.
}
