import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-integer-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./integer-adapter.story.html",
  styleUrl: "./integer-adapter.story.scss",
})
export class IntegerAdapterStorySource {
}
