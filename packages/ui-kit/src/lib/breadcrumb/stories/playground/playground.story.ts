import { UIBreadcrumb } from "../../breadcrumb.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBreadcrumb],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/breadcrumb/breadcrumb.stories.ts.

  public ariaLabel = "Breadcrumb" as const;
  public disabled = false as const;
  public items = undefined as never;
  public separator = "/" as const;
  public variant = "link" as const;
}
