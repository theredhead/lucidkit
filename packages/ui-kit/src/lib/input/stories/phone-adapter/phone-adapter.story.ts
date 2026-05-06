import { UIInput } from "../../input.component";
import { PhoneTextAdapter } from "../../adapters/phone-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-phone-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./phone-adapter.story.html",
  styleUrl: "./phone-adapter.story.scss",
})
export class PhoneAdapterStorySource {
  protected readonly adapter = new PhoneTextAdapter();
  protected rawPhone = "";
  protected phoneValue: string | null = null;
}
