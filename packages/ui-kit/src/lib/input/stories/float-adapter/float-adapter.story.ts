import { UIInput } from "../../input.component";
import { FloatTextAdapter } from "../../adapters/float-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-float-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./float-adapter.story.html",
  styleUrl: "./float-adapter.story.scss",
})
export class FloatAdapterStorySource {
  protected readonly adapter = new FloatTextAdapter();
  protected rawFloat = "";
  protected floatValue: string | null = null;
}
