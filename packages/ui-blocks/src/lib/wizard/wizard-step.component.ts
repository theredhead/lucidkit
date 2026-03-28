import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/foundation";

/**
 * A single step inside a {@link UIWizard}.
 *
 * Wrap each piece of wizard content in this component and project
 * it into `<ui-wizard>`.
 *
 * ### Usage
 * ```html
 * <ui-wizard>
 *   <ui-wizard-step label="Account">…</ui-wizard-step>
 *   <ui-wizard-step label="Profile">…</ui-wizard-step>
 *   <ui-wizard-step label="Confirm">…</ui-wizard-step>
 * </ui-wizard>
 * ```
 */
@Component({
  selector: "ui-wizard-step",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  template: "<ng-template #stepContent><ng-content /></ng-template>",
  host: {
    class: "ui-wizard-step",
    "[style.display]": '"none"',
  },
})
export class UIWizardStep {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Label shown in the step indicator. */
  public readonly label = input.required<string>();

  /** Whether this step is optional (shown as hint text). */
  public readonly optional = input<boolean>(false);

  /**
   * Whether the user can advance past this step. Bind a
   * signal expression to create a validation gate.
   *
   * @default true
   */
  public readonly canAdvance = input<boolean>(true);

  // ── View queries ──────────────────────────────────────────────────

  /** @internal — template holding the step's projected content. */
  public readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>("stepContent");
}
