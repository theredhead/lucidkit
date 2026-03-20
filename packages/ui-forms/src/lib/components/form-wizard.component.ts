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
  },
  template: `
    @if (engine().schema.title) {
      <h2 class="fw-title">{{ engine().schema.title }}</h2>
    }
    @if (engine().schema.description) {
      <p class="fw-description">{{ engine().schema.description }}</p>
    }

    <!-- Step indicator -->
    <nav class="fw-steps" aria-label="Form steps">
      @for (step of visibleGroups(); track step.definition.id; let i = $index) {
        <button
          type="button"
          class="fw-step"
          [class.fw-step--active]="i === currentIndex()"
          [class.fw-step--completed]="i < currentIndex()"
          [disabled]="i > currentIndex()"
          (click)="goTo(i)"
          [attr.aria-current]="i === currentIndex() ? 'step' : null"
        >
          <span class="fw-step-number">{{ i + 1 }}</span>
          @if (step.definition.title) {
            <span class="fw-step-label">{{ step.definition.title }}</span>
          }
        </button>
      }
    </nav>

    <!-- Current group -->
    @if (currentGroup(); as group) {
      <ui-form-group [state]="group" />
    }

    <!-- Navigation -->
    <div class="fw-actions">
      @if (currentIndex() > 0) {
        <button type="button" class="fw-btn fw-btn--prev" (click)="prev()">
          {{ prevLabel() }}
        </button>
      }

      <div class="fw-spacer"></div>

      @if (isLastStep()) {
        <button
          type="button"
          class="fw-btn fw-btn--submit"
          [disabled]="!engine().valid()"
          (click)="onSubmit()"
        >
          {{ submitLabel() }}
        </button>
      } @else {
        <button
          type="button"
          class="fw-btn fw-btn--next"
          [disabled]="!currentStepValid()"
          (click)="next()"
        >
          {{ nextLabel() }}
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .fw-title {
      font-size: 1.375rem;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--ui-text, #1d232b);
    }

    .fw-description {
      font-size: 0.9375rem;
      opacity: 0.65;
      margin: 0 0 16px;
      line-height: 1.4;
    }

    /* Step indicator */

    .fw-steps {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      padding: 0;
    }

    .fw-step {
      appearance: none;
      border: none;
      background: var(--ui-surface, #f0f2f5);
      color: var(--ui-text, #1d232b);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      opacity: 0.55;
      transition:
        opacity 0.15s ease,
        background 0.15s ease;
    }

    .fw-step:disabled {
      cursor: default;
    }

    .fw-step--active {
      opacity: 1;
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
    }

    .fw-step--completed {
      opacity: 0.8;
    }

    .fw-step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.1);
    }

    .fw-step--active .fw-step-number {
      background: rgba(255, 255, 255, 0.25);
    }

    .fw-step-label {
      white-space: nowrap;
    }

    /* Navigation buttons */

    .fw-actions {
      display: flex;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--ui-border, #d7dce2);
      margin-top: 24px;
    }

    .fw-spacer {
      flex: 1;
    }

    .fw-btn {
      appearance: none;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .fw-btn:disabled {
      opacity: 0.45;
      cursor: default;
    }

    .fw-btn:focus-visible {
      outline: 2px solid var(--theredhead-primary, #3584e4);
      outline-offset: 2px;
    }

    .fw-btn--prev {
      background: transparent;
      color: var(--ui-text, #1d232b);
      border: 1px solid var(--ui-border, #d7dce2);
    }

    .fw-btn--prev:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.04);
    }

    .fw-btn--next,
    .fw-btn--submit {
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
    }

    .fw-btn--next:hover:not(:disabled),
    .fw-btn--submit:hover:not(:disabled) {
      opacity: 0.88;
    }

    /* Dark mode */

    :host-context(html.dark-theme) {
      .fw-title {
        color: var(--ui-text, #f2f6fb);
      }

      .fw-step {
        background: var(--ui-surface, #2a2f38);
        color: var(--ui-text, #f2f6fb);
      }

      .fw-actions {
        border-top-color: var(--ui-border, #3a3f47);
      }

      .fw-btn--prev {
        color: var(--ui-text, #f2f6fb);
        border-color: var(--ui-border, #3a3f47);
      }

      .fw-btn--prev:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.06);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .fw-title {
          color: var(--ui-text, #f2f6fb);
        }

        .fw-step {
          background: var(--ui-surface, #2a2f38);
          color: var(--ui-text, #f2f6fb);
        }

        .fw-actions {
          border-top-color: var(--ui-border, #3a3f47);
        }

        .fw-btn--prev {
          color: var(--ui-text, #f2f6fb);
          border-color: var(--ui-border, #3a3f47);
        }

        .fw-btn--prev:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
        }
      }
    }
  `,
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
