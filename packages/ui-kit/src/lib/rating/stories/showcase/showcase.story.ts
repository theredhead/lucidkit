import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UIRating } from "../../rating.component";

@Component({
  selector: "ui-rating-demo",
  standalone: true,
  imports: [UIRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class RatingDemo {
  protected readonly rating = signal(3);
}
