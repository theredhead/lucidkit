import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody } from "../../card.component";

@Component({
  selector: "ui-card-story-body-only",
  standalone: true,
  imports: [UICard, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./body-only.story.html",
  styleUrl: "./body-only.story.scss",
})
export class UICardStoryBodyOnly {}
