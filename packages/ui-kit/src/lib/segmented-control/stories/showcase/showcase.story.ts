import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import {
  UISegmentedControl,
  type SegmentedItem,
} from "../../segmented-control.component";
import { UIIcons } from "../../../icon";

@Component({
  selector: "ui-segmented-control-demo",
  standalone: true,
  imports: [UISegmentedControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class SegmentedControlDemo {
  protected readonly view = signal("week");
  protected readonly iconView = signal("grid");
  protected readonly mixed = signal("a");

  protected readonly viewItems: SegmentedItem[] = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

  protected readonly iconItems: SegmentedItem[] = [
    { id: "list", label: "List", icon: UIIcons.Lucide.Design.LayoutList },
    { id: "grid", label: "Grid", icon: UIIcons.Lucide.Design.LayoutGrid },
  ];

  protected readonly mixedItems: SegmentedItem[] = [
    { id: "a", label: "Option A" },
    { id: "b", label: "Option B", disabled: true },
    { id: "c", label: "Option C" },
  ];
}
