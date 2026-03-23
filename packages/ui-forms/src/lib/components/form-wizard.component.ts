// ── UIFormWizard ─────────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { FormEngine, type GroupState } from "../engine/form-engine";
import type { FormValues } from "../types/form-schema.types";
import { UIFormGroup } from "./form-group.component";

/**
 * Renders a {@link FormEngine}'s groups as wizard steps — one group
 * at a time with previous / next / submit navigation.
 *
 * Only visible groups are included as steps. The wizard validates
 * the current step before allowing navigation to the next.
 *
 * @example
 * ```html
 * <ui-form-wizard
 *   [engine]="engine"
 *   (formSubmit)="onSubmit($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-form-wizard",
  standalone: true,
  imports: [UIFormGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-form-wizard",
    "[style.--ui-form-field-min-width]": "fieldMinWidth() + 'px'",
  },
  templateUrl: "./form-wizard.component.html",
  styleUrl: "./form-wizard.component.scss",
})
export class UIFormWizard {
  /** The form engine instance that drives this wizard. */
  public readonly engine = input.required<FormEngine>();

  /** Label for the "Next" button. */
  public readonly nextLabel = input<string>("Next");

  /** Label for the "Previous" button. */
  public readonly prevLabel = input<string>("Previous");

  /** Label for the "Submit" button (last step). */
  public readonly submitLabel = input<string>("Submit");

  /** Minimum width (in pixels) for form field controls. Defaults to `200`. */
  public readonly fieldMinWidth = input<number>(200);

  /** Emitted when the form is submitted (last step, valid). */
  public readonly formSubmit = output<FormValues>();

  /** Current step index. */
  protected readonly currentIndex = signal(0);

  /** Only visible groups are wizard steps. */
  protected readonly visibleGroups = computed(() =>
    this.engine().groups.filter((g) => g.visible()),
  );

  /** The currently displayed group state. */
  protected readonly currentGroup = computed<GroupState | null>(() => {
    const groups = this.visibleGroups();
    return groups[this.currentIndex()] ?? null;
  });

  /** Whether the current step is the last one. */
  protected readonly isLastStep = computed(
    () => this.currentIndex() === this.visibleGroups().length - 1,
  );

  /** Whether the current step's fields are all valid. */
  protected readonly currentStepValid = computed(() => {
    const group = this.currentGroup();
    return group ? group.valid() : false;
  });

  /** Navigate to the next step (marks current fields touched). */
  public next(): void {
    const group = this.currentGroup();
    if (group) {
      for (const field of group.fields) {
        field.touched.set(true);
      }
    }
    if (this.currentStepValid() && !this.isLastStep()) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  /** Navigate to the previous step. */
  public prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  /** Jump to a specific step. */
  public goTo(index: number): void {
    if (index >= 0 && index <= this.currentIndex()) {
      this.currentIndex.set(index);
    }
  }

  /** @internal Submit handler. */
  protected onSubmit(): void {
    const eng = this.engine();
    eng.markAllTouched();
    if (eng.valid()) {
      this.formSubmit.emit(eng.output()());
    }
  }
}
