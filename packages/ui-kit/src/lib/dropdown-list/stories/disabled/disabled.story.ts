import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIDropdownList } from "../../dropdown-list.component";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  public readonly options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
  ];
}
