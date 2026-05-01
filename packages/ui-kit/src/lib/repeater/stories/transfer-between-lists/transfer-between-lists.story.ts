import { UIRepeater } from "../../repeater.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { ArrayDatasource } from "../../../table-view/datasources/array-datasource";

interface TransferItem {
  readonly name: string;
}

const AVAILABLE_ITEMS: readonly TransferItem[] = [
  { name: "Roadmap" },
  { name: "Design review" },
  { name: "Sprint retro" },
];

const SELECTED_ITEMS: readonly TransferItem[] = [{ name: "Launch checklist" }];

@Component({
  selector: "ui-transfer-between-lists-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRepeater],
  templateUrl: "./transfer-between-lists.story.html",
  styleUrl: "./transfer-between-lists.story.scss",
})
export class TransferBetweenListsStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly dsAvailable = new ArrayDatasource([...AVAILABLE_ITEMS]);

  public readonly dsSelected = new ArrayDatasource([...SELECTED_ITEMS]);

  public readonly reorderable = input(true);

  public onTransfer(_event: unknown): void {}
}
