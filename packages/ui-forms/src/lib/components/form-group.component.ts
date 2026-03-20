// ── UIFormGroup ──────────────────────────────────────────────────────

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { GroupState } from "../engine/form-engine";
import { UIFormField } from "./form-field/form-field.component";

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
  host: {
    class: "ui-form-group",
    "[class.ui-form-group--hidden]": "!state().visible()",
  },
  template: `
    @if (state().visible()) {
      @if (state().definition.title) {
        <h3 class="fg-title">{{ state().definition.title }}</h3>
      }
      @if (state().definition.description) {
        <p class="fg-description">{{ state().definition.description }}</p>
      }
      <div class="fg-fields">
        @for (field of state().fields; track field.definition.id) {
          <ui-form-field [state]="field" />
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    :host(.ui-form-group--hidden) {
      display: none;
    }

    .fg-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 4px;
      color: var(--ui-text, #1d232b);
    }

    .fg-description {
      font-size: 0.875rem;
      opacity: 0.65;
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .fg-fields {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }

    .fg-fields ::ng-deep ui-form-field {
      grid-column: 1 / -1;
    }

    :host-context(html.dark-theme) {
      .fg-title {
        color: var(--ui-text, #f2f6fb);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .fg-title {
          color: var(--ui-text, #f2f6fb);
        }
      }
    }
  `,
})
export class UIFormGroup {
  /** The group state managed by the {@link FormEngine}. */
  public readonly state = input.required<GroupState>();
}
