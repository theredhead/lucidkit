import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from "@angular/core";

import {
  EmailDetector,
  EmojiDetector,
  PhoneNumberDetector,
  type IDataDetector,
  UrlDetector,
} from "@theredhead/lucid-foundation";
import { UIRichTextEditor } from "@theredhead/lucid-blocks";

import {
  UIRichTextView,
  type RichTextViewStrategy,
} from "../../rich-text-view.component";
import { UISplitContainer } from "../../../split-container/split-container.component";
import { UISplitPanel } from "../../../split-container/split-panel.component";

const DEFAULT_CONTENT = `<h2>Detector playground</h2>
<p>Email ada@example.com or support@theredhead.dev.</p>
<p>Visit https://theredhead.dev/docs or call +1 (555) 123-4567.</p>
<p>Plaintext emoticons convert too :-) ;-) :D &lt;3</p>`;

@Component({
  selector: "ui-data-detectors-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor, UIRichTextView, UISplitContainer, UISplitPanel],
  templateUrl: "./data-detectors-playground.story.html",
  styleUrl: "./data-detectors-playground.story.scss",
})
export class DataDetectorsPlaygroundStorySource {
  public readonly strategy = input<RichTextViewStrategy>("html");

  public readonly ariaLabel = input<string>(
    "Rich text preview with data detectors",
  );

  public readonly editorPlaceholder = input<string>(
    "Type or paste content to test detectors…",
  );

  public readonly dividerWidth = input(10);

  public readonly initialContent = input<string>(DEFAULT_CONTENT);

  public readonly phoneNumbers = input(true);

  public readonly urls = input(true);

  public readonly emails = input(true);

  public readonly emoji = input(true);

  protected readonly content = signal(DEFAULT_CONTENT);

  protected readonly activeDetectors = computed<readonly IDataDetector[]>(
    () => {
      const detectors: IDataDetector[] = [];
      if (this.phoneNumbers()) {
        detectors.push(this.phoneNumberDetector);
      }
      if (this.urls()) {
        detectors.push(this.urlDetector);
      }
      if (this.emails()) {
        detectors.push(this.emailDetector);
      }
      if (this.emoji()) {
        detectors.push(this.emojiDetector);
      }
      return detectors;
    },
  );

  protected readonly activeDetectorLabels = computed(() => {
    const labels: string[] = [];
    if (this.phoneNumbers()) {
      labels.push("Phone numbers");
    }
    if (this.urls()) {
      labels.push("URLs");
    }
    if (this.emails()) {
      labels.push("Email addresses");
    }
    if (this.emoji()) {
      labels.push("Plaintext emoticons");
    }
    return labels;
  });

  private readonly phoneNumberDetector = new PhoneNumberDetector();

  private readonly urlDetector = new UrlDetector();

  private readonly emailDetector = new EmailDetector();

  private readonly emojiDetector = new EmojiDetector();

  public constructor() {
    effect(() => {
      this.content.set(this.initialContent());
    });
  }

  protected updateContent(value: string): void {
    this.content.set(value);
  }
}
