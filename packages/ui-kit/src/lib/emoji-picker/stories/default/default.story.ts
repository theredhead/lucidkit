import { UIEmojiPicker } from "../../emoji-picker.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIEmojiPicker],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly searchPlaceholder = input<string>("Search emoji\u2026");
  public readonly previewSize = input<number>(64);
  public readonly ariaLabel = input<string>("Emoji picker");

  protected readonly lastEmoji = signal<string | undefined>(undefined);

  protected onEmoji(emoji: string): void {
    this.lastEmoji.set(emoji);
  }
}
