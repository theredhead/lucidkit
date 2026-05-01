import { ChangeDetectionStrategy, Component, model } from "@angular/core";

import { UIDropdownList } from "../../dropdown-list.component";

@Component({
  selector: "ui-preselected-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  templateUrl: "./preselected.story.html",
  styleUrl: "./preselected.story.scss",
})
export class PreselectedStorySource {
  public readonly options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Mango", value: "mango" },
  ];

  public readonly selected = model<string>("banana");
}
