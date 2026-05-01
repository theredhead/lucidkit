import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-uuid-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./uuid-adapter.story.html",
  styleUrl: "./uuid-adapter.story.scss",
})
export class UuidAdapterStorySource {
}
