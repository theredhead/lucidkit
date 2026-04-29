import { ChangeDetectionStrategy, Component } from "@angular/core";

import {
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICardImage,
} from "../../card.component";
import { UIButton } from "../../../button/button.component";

@Component({
  selector: "ui-card-story-body-image",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody, UICardImage, UICardFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./body-image.story.html",
  styleUrl: "./body-image.story.scss",
})
export class UICardStoryBodyImage {}