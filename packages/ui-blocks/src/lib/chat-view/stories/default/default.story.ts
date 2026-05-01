import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIChatView } from "../../chat-view.component";
import type {
  ChatComposerMode,
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
  id: "grace",
  name: "Grace Hopper",
  avatarEmail: "grace@example.com",
};

const DEFAULT_MESSAGES: readonly ChatMessage[] = [
  {
    id: "1",
    content: "Morning. Did the detector playground land cleanly?",
    timestamp: new Date("2026-04-30T09:15:00"),
    sender: OTHER_USER,
  },
  {
    id: "2",
    content: "Yes. The Storybook build is green again.",
    timestamp: new Date("2026-04-30T09:16:00"),
    sender: CURRENT_USER,
  },
  {
    id: "3",
    content:
      "Good. Next we should keep working through the story cleanup list.",
    timestamp: new Date("2026-04-30T09:17:00"),
    sender: OTHER_USER,
  },
];

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChatView],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly ariaLabel = input<string>("Chat");

  public readonly composerMode = input<ChatComposerMode>("text");

  public readonly composerPresentation = input<"default" | "compact">(
    "compact",
  );

  public readonly composerToolbarActions = input<readonly string[] | undefined>(
    undefined,
  );

  public readonly placeholder = input<string>("Type a message…");

  public readonly messageSend = output<MessageSendEvent>();

  protected readonly currentUser: ChatParticipant = CURRENT_USER;

  protected readonly messages: readonly ChatMessage[] = DEFAULT_MESSAGES;
}
