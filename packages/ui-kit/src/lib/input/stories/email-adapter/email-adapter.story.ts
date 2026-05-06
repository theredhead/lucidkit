import { UIInput } from "../../input.component";
import { EmailTextAdapter } from "../../adapters/email-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-email-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./email-adapter.story.html",
  styleUrl: "./email-adapter.story.scss",
})
export class EmailAdapterStorySource {
  protected readonly adapter = new EmailTextAdapter();
  protected email = "";
  protected normalizedEmail: string | null = null;
}
