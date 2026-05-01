import { UIInput } from "../../input.component";

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
}
