import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-compact-chat-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./compact-chat.story.html",
  styleUrl: "./compact-chat.story.scss",
})
export class CompactChatStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
