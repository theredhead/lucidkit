import { UIEmojiPicker } from "../../emoji-picker.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-categories-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIEmojiPicker],
  templateUrl: "./custom-categories.story.html",
  styleUrl: "./custom-categories.story.scss",
})
export class CustomCategoriesStorySource {
}
