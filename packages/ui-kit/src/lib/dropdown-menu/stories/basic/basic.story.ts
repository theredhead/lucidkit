import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIButton } from "../../../button/button.component";
import {
  type DropdownAlign,
  UIDropdownDivider,
  UIDropdownItem,
  UIDropdownMenu,
} from "../../dropdown-menu.component";

@Component({
  selector: "ui-basic-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu, UIButton, UIDropdownItem, UIDropdownDivider],
  templateUrl: "./basic.story.html",
  styleUrl: "./basic.story.scss",
})
export class BasicStorySource {
  public readonly align = input<DropdownAlign>("start");
  public readonly ariaLabel = input("Menu");

  public readonly edit = output<void>();
  public readonly duplicate = output<void>();
  public readonly archive = output<void>();

  public onEdit(): void {
    this.edit.emit();
  }

  public onDuplicate(): void {
    this.duplicate.emit();
  }

  public onArchive(): void {
    this.archive.emit();
  }
}
