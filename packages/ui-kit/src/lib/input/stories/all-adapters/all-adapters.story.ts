import { UIInput } from "../../input.component";
import { EmailTextAdapter } from "../../adapters/email-text-adapter";
import { UrlTextAdapter } from "../../adapters/url-text-adapter";
import { IPAddressTextAdapter } from "../../adapters/ip-address-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-adapters-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./all-adapters.story.html",
  styleUrl: "./all-adapters.story.scss",
})
export class AllAdaptersStorySource {
  protected readonly emailAdapter = new EmailTextAdapter();
  protected readonly urlAdapter = new UrlTextAdapter();
  protected readonly ipAdapter = new IPAddressTextAdapter();
  protected email = "";
  protected url = "";
  protected ip = "";
}
