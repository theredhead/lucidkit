import { UIInput } from "../../input.component";
import { IPAddressTextAdapter } from "../../adapters/ip-address-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-ipaddress-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./ipaddress-adapter.story.html",
  styleUrl: "./ipaddress-adapter.story.scss",
})
export class IPAddressAdapterStorySource {
  protected readonly adapter = new IPAddressTextAdapter();
  protected rawIp = "";
  protected ip: string | null = null;
}
