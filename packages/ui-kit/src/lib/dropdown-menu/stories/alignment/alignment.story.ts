import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIDropdownItem, UIDropdownMenu } from "../../dropdown-menu.component";

@Component({
  selector: "ui-alignment-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu, UIButton, UIDropdownItem],
  templateUrl: "./alignment.story.html",
  styleUrl: "./alignment.story.scss",
})
export class AlignmentStorySource {}
