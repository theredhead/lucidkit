import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIChatView } from "../../chat-view.component";
import type {
  ChatMessage,
  ChatParticipant,
  MessageSendEvent,
} from "../../chat-view.types";

const CURRENT_USER: ChatParticipant = {
  id: "me",
  name: "Ada Lovelace",
  avatarEmail: "ada@example.com",
};

const OTHER_USER: ChatParticipant = {
  id: "bot",
  name: "Build Bot",
};

const RICH_TEXT_MESSAGES: readonly ChatMessage[] = [
  {
    id: "1",
    content:
      "<p><strong>Build complete.</strong> Detector playground added.</p>",
    timestamp: new Date("2026-04-30T10:00:00"),
    sender: OTHER_USER,
    type: "rich-text",
  },
  {
    id: "2",
    content:
      "<p>Next step: continue story cleanup and wire actions consistently.</p>",
    timestamp: new Date("2026-04-30T10:02:00"),
    sender: CURRENT_USER,
    type: "rich-text",
  },
];

@Component({
  selector: "ui-rich-text-composer-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChatView],
  templateUrl: "./rich-text-composer.story.html",
  styleUrl: "./rich-text-composer.story.scss",
})
export class RichTextComposerStorySource {
  public readonly ariaLabel = input<string>("Chat");

  public readonly composerPresentation = input<"default" | "compact">(
    "compact",
  );

  public readonly composerToolbarActions = input<readonly string[] | undefined>(
    undefined,
  );

  public readonly placeholder = input<string>("Type a rich-text message…");

  public readonly messageSend = output<MessageSendEvent>();

  protected readonly currentUser: ChatParticipant = CURRENT_USER;

  protected readonly messages: readonly ChatMessage[] = RICH_TEXT_MESSAGES;
}
