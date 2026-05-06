import { UIInput } from "../../input.component";
import { ColorTextAdapter } from "../../adapters/color-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-color-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./color-adapter.story.html",
  styleUrl: "./color-adapter.story.scss",
})
export class ColorAdapterStorySource {
  protected readonly adapter = new ColorTextAdapter();
  protected rawColor = "";
  protected colorValue: string | null = null;
}
