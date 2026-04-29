import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-item-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./disabled-item.story.html",
  styleUrl: "./disabled-item.story.scss",
})
export class DisabledItemStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/radio-group/radio-group.stories.ts.
}
