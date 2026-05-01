import { UIInput } from "../../input.component";

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
}
