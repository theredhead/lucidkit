import { ChangeDetectionStrategy, Component } from "@angular/core";

import {
  UIDropdownList,
  type SelectOption,
} from "../../dropdown-list.component";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  protected readonly options: readonly SelectOption[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "date", label: "Date" },
    { value: "elderberry", label: "Elderberry" },
  ];

  protected placeholder = "— Select a fruit —";
  protected disabled = false;
  protected ariaLabel = "Fruit selector";
}
