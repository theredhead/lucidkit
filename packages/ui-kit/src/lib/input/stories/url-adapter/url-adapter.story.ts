import { UIInput } from "../../input.component";
import { UrlTextAdapter } from "../../adapters/url-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-url-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./url-adapter.story.html",
  styleUrl: "./url-adapter.story.scss",
})
export class UrlAdapterStorySource {
  protected readonly adapter = new UrlTextAdapter();
  protected rawUrl = "";
  protected fullUrl: string | null = null;
}
