import { UIInput } from "../../input.component";
import { HexadecimalTextAdapter } from "../../adapters/hexadecimal-text-adapter";

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
  protected readonly adapter = new HexadecimalTextAdapter();
  protected rawHex = "";
  protected hexValue: string | null = null;
}
