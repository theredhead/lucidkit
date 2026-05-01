import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-slug-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./slug-adapter.story.html",
  styleUrl: "./slug-adapter.story.scss",
})
export class SlugAdapterStorySource {
}
