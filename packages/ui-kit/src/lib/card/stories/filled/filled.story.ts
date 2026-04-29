import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";

@Component({
  selector: "ui-card-story-filled",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./filled.story.html",
  styleUrl: "./filled.story.scss",
})
export class UICardStoryFilled {}
