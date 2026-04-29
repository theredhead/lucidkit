import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UIChip } from "../../chip.component";

@Component({
  selector: "ui-chip-demo",
  standalone: true,
  imports: [UIChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class ChipDemo {
  public readonly tags = signal([
    "Angular",
    "TypeScript",
    "Signals",
    "RxJS",
    "SCSS",
  ]);

  public removeTag(tag: string): void {
    this.tags.update((t) => t.filter((x) => x !== tag));
  }
}
