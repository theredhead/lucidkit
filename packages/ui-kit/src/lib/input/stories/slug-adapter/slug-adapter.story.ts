import { UIInput } from "../../input.component";
import { SlugTextAdapter } from "../../adapters/slug-text-adapter";

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
  protected readonly adapter = new SlugTextAdapter();
  protected rawSlug = "";
  protected slugValue: string | null = null;
}
