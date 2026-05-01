import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-compact-chat-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./compact-chat.story.html",
  styleUrl: "./compact-chat.story.scss",
})
export class CompactChatStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Message…");
  public readonly ariaLabel = input("Chat composer");
  public readonly mode = input<RichTextEditorMode>("markdown");
  public readonly presentation = input<"default" | "compact">("compact");

  public readonly value = model("");
}
