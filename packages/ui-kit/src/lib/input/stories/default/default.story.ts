import { UIInput } from "../../input.component";
import { EmailTextAdapter } from "../../adapters/email-text-adapter";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly adapter = new EmailTextAdapter();
  public readonly rawText = model("");
  public readonly processedValue = model<string | null>(null);
  public readonly type = input("email");
  public readonly placeholder = input("user@example.com");
  public readonly disabled = input(false);
  public readonly multiline = input(false);
  public readonly rows = input(3);
}
