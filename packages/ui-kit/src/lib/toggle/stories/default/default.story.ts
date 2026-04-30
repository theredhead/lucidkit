import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { UIToggle } from "../../toggle.component";
import { type ToggleSize } from "../../toggle.component";

// ── Demo wrapper: Default ────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-default",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class DemoToggleDefault {
  public readonly ariaLabel = input("");

  public readonly disabled = input(false);

  public readonly offLabel = input("");

  public readonly onLabel = input("");

  public readonly size = input<ToggleSize>("medium");

  public readonly value = input(false);

  public readonly valueChange = output<boolean>();

  protected readonly currentValue = signal(false);

  public constructor() {
    effect(() => {
      this.currentValue.set(this.value());
    });
  }

  protected onValueChange(next: boolean): void {
    this.currentValue.set(next);
    this.valueChange.emit(next);
  }
}
