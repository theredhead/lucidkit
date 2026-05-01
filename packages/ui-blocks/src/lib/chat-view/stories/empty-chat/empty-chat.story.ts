import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIChatView } from "../../chat-view.component";
import type {
  ChatComposerMode,
  ChatParticipant,
  MessageSendEvent,
} from "../../chat-view.types";

const CURRENT_USER: ChatParticipant = {
  id: "me",
  name: "Ada Lovelace",
  avatarEmail: "ada@example.com",
};

@Component({
  selector: "ui-empty-chat-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChatView],
  templateUrl: "./empty-chat.story.html",
  styleUrl: "./empty-chat.story.scss",
})
export class EmptyChatStorySource {
  public readonly ariaLabel = input<string>("Chat");

  public readonly composerMode = input<ChatComposerMode>("text");

  public readonly composerPresentation = input<"default" | "compact">(
    "compact",
  );

  public readonly composerToolbarActions = input<readonly string[] | undefined>(
    undefined,
  );

  public readonly placeholder = input<string>("Type the first message…");

  public readonly messageSend = output<MessageSendEvent>();

  protected readonly currentUser: ChatParticipant = CURRENT_USER;
}
