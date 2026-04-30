import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";

import { UIChip, type ChipColor } from "../../chip.component";

@Component({
  selector: "ui-chip-demo",
  standalone: true,
  imports: [UIChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class ChipDemo {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly color = input<ChipColor>("primary");

  public readonly disabled = input(false);

  public readonly removable = input(false);

  public readonly removed = output<void>();

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

  public emitRemoved(): void {
    this.removed.emit();
  }
}
