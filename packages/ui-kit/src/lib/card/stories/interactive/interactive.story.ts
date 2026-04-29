import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";

@Component({
  selector: "ui-card-story-interactive",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./interactive.story.html",
  styleUrl: "./interactive.story.scss",
})
export class UICardStoryInteractive {}
