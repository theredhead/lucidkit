import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import {
  type CardVariant,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
} from "../../card.component";
import { UIButton } from "../../../button/button.component";

@Component({
  selector: "ui-card-story-elevated",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody, UICardFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./elevated.story.html",
  styleUrl: "./elevated.story.scss",
})
export class UICardStoryElevated {
  public readonly variant = input<CardVariant>("elevated");

  public readonly interactive = input(false);
}
