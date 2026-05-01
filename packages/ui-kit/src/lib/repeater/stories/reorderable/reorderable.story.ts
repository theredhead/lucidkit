import { UIRepeater } from "../../repeater.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { ArrayDatasource } from "../../../table-view/datasources/array-datasource";
import type { RepeaterReorderEvent } from "../../repeater.types";

interface ReorderableItem {
  readonly name: string;
}

const ITEMS: readonly ReorderableItem[] = [
  { name: "Backlog" },
  { name: "Design" },
  { name: "Build" },
  { name: "QA" },
];

@Component({
  selector: "ui-reorderable-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRepeater],
  templateUrl: "./reorderable.story.html",
  styleUrl: "./reorderable.story.scss",
})
export class ReorderableStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly ds = new ArrayDatasource([...ITEMS]);

  public readonly reorderable = input(true);

  public onReorder(_event: RepeaterReorderEvent): void {}
}
