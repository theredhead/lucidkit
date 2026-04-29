import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";

@Component({
  selector: "ui-card-story-outlined",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./outlined.story.html",
  styleUrl: "./outlined.story.scss",
})
export class UICardStoryOutlined {}
