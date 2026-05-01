import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import { UIDropdownList } from "../../dropdown-list.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly placeholder = input<string>("\u2014 Select \u2014");
  public readonly disabled = input<boolean>(false);
  public readonly ariaLabel = input<string>("Choose a fruit");

  public readonly selectedFruit = model<string>("");

  public readonly fruitOptions = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Mango", value: "mango" },
  ];
}
