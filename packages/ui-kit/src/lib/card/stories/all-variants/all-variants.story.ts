import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";

@Component({
  selector: "ui-card-story-all-variants",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./all-variants.story.html",
  styleUrl: "./all-variants.story.scss",
})
export class UICardStoryAllVariants {}