import { UIChatView } from "../../chat-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-empty-chat-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChatView],
  templateUrl: "./empty-chat.story.html",
  styleUrl: "./empty-chat.story.scss",
})
export class EmptyChatStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/chat-view/chat-view.stories.ts.
}
