import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIButton } from "../../../button/button.component";
import {
  UIDropdownDivider,
  UIDropdownItem,
  UIDropdownMenu,
} from "../../dropdown-menu.component";

@Component({
  selector: "ui-with-icons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu, UIButton, UIDropdownItem, UIDropdownDivider],
  templateUrl: "./with-icons.story.html",
  styleUrl: "./with-icons.story.scss",
})
export class WithIconsStorySource {}
