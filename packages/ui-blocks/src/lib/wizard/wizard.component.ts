import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

import { UIWizardStep } from "./wizard-step.component";
import type { StepChangeEvent } from "./wizard.types";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

/**
 * A multi-step workflow shell with a step indicator, navigation
 * buttons, and optional validation gates.
 *
 * Steps are defined by projecting `<ui-wizard-step>` children.
 * The wizard discovers them via content queries and renders only
 * the active step.
 *
 * ### Basic usage
 * ```html
 * <ui-wizard (complete)="onFinish()">
 *   <ui-wizard-step label="Account">…</ui-wizard-step>
 *   <ui-wizard-step label="Profile">…</ui-wizard-step>
 *   <ui-wizard-step label="Confirm">…</ui-wizard-step>
 * </ui-wizard>
 * ```
 *
 * ### With validation gates
 * ```html
 * <ui-wizard linear>
 *   <ui-wizard-step label="Details" [canAdvance]="formValid()">
 *     …
 *   </ui-wizard-step>
 *   <ui-wizard-step label="Review">…</ui-wizard-step>
 * </ui-wizard>
 * ```
 */
@Component({
  selector: "ui-wizard",
  standalone: true,
  imports: [NgTemplateOutlet, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  templateUrl: "./wizard.component.html",
  styleUrl: "./wizard.component.scss",
  host: {
    class: "ui-wizard",
  },
})
export class UIWizard {
  // ── Inputs ────────────────────────────────────────────────────────

  /**
   * When `true`, the user must complete steps in order and
   * cannot click ahead on the step indicator.
   */
  public readonly linear = input<boolean>(false);

  /** Whether to show the step indicator bar. */
  public readonly showStepIndicator = input<boolean>(true);

  /** Label for the Back button. */
  public readonly backLabel = input<string>("Back");

  /** Label for the Next button. */
  public readonly nextLabel = input<string>("Next");

  /** Label for the Finish button (shown on the last step). */
  public readonly finishLabel = input<string>("Finish");

  /** Accessible label for the wizard. */
  public readonly ariaLabel = input<string>("Wizard");

  // ── Models ────────────────────────────────────────────────────────

  /** Zero-based index of the active step (two-way bindable). */
  public readonly activeIndex = model<number>(0);

  // ── Content children ──────────────────────────────────────────────

  /** @internal — discovered wizard steps. */
  public readonly steps = contentChildren(UIWizardStep);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted when the active step changes. */
  public readonly stepChange = output<StepChangeEvent>();

  /** Emitted when the user clicks Finish on the last step. */
  public readonly complete = output<void>();

  // ── Icons ─────────────────────────────────────────────────────────

  /** @internal */
  protected readonly checkIcon = UIIcons.Lucide.Notifications.Check;

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — the currently active step. */
  protected readonly activeStep = computed(() => {
    const all = this.steps();
    const idx = this.activeIndex();
    return idx >= 0 && idx < all.length ? all[idx] : undefined;
  });

  /** @internal */
  protected readonly isFirstStep = computed(() => this.activeIndex() === 0);

  /** @internal */
  protected readonly isLastStep = computed(
    () => this.activeIndex() === this.steps().length - 1,
  );

  /** @internal — whether the current step allows advancing. */
  protected readonly canGoNext = computed(() => {
    const step = this.activeStep();
    return step ? step.canAdvance() : false;
  });

  // ── Public methods ────────────────────────────────────────────────

  /** Advance to the next step (respects validation). */
  public next(): void {
    if (this.isLastStep() || !this.canGoNext()) return;
    this.goToStep(this.activeIndex() + 1);
  }

  /** Go back to the previous step. */
  public previous(): void {
    if (this.isFirstStep()) return;
    this.goToStep(this.activeIndex() - 1);
  }

  /** Navigate to a specific step by index. */
  public goToStep(index: number): void {
    const all = this.steps();
    if (index < 0 || index >= all.length) return;

    // In linear mode, prevent skipping ahead beyond validated steps
    if (this.linear() && index > this.activeIndex()) {
      // Check all steps between current and target are valid
      for (let i = this.activeIndex(); i < index; i++) {
        if (!all[i].canAdvance()) return;
      }
    }

    const previous = this.activeIndex();
    if (previous === index) return;

    this.activeIndex.set(index);
    this.stepChange.emit({ previousIndex: previous, currentIndex: index });
  }

  /** Complete the wizard (only works on the last step). */
  public finish(): void {
    if (!this.isLastStep() || !this.canGoNext()) return;
    this.complete.emit();
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — handle step indicator click. */
  protected onStepClick(index: number): void {
    if (this.linear() && index > this.activeIndex()) {
      // In linear mode, only allow clicking completed steps or current
      return;
    }
    this.goToStep(index);
  }

  /** @internal — whether a step indicator is clickable. */
  protected isStepClickable(index: number): boolean {
    if (!this.linear()) return true;
    return index <= this.activeIndex();
  }
}
