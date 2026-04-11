// ── UIFormGroup ──────────────────────────────────────────────────────

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { GroupState } from "../engine/form-engine";
import { UIFormField } from "./form-field/form-field.component";
import { UISurface } from "@theredhead/foundation";

/**
 * Renders a group of form fields as a visual section (fieldset).
 *
 * In sequential (non-wizard) mode every group is displayed
 * vertically. In wizard mode, {@link UIFormWizard} controls which
 * group is visible.
 *
 * @example
 * ```html
 * <ui-form-group [state]="groupState" />
 * ```
 */
@Component({
  selector: "ui-form-group",
  standalone: true,
  imports: [UIFormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-form-group",
    "[class.hidden]": "!state().visible()",
  },
  templateUrl: "./form-group.component.html",
  styleUrl: "./form-group.component.scss",
})
export class UIFormGroup {
  /** The group state managed by the {@link FormEngine}. */
  public readonly state = input.required<GroupState>();
}
