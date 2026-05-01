import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-hexadecimal-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./hexadecimal-adapter.story.html",
  styleUrl: "./hexadecimal-adapter.story.scss",
})
export class HexadecimalAdapterStorySource {
}
