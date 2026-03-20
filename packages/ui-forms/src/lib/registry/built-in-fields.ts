// ── Built-in field registrations for @theredhead/ui-kit ──────────────

import type { EnvironmentProviders } from "@angular/core";

import {
  UIInput,
  UISelect,
  UICheckbox,
  UIToggle,
  UIRadioGroup,
  UIAutocomplete,
  UIDatePicker,
  UITimePicker,
  UIDateTimePicker,
  UIColorPicker,
  UISlider,
  UIRichTextEditor,
  UIFileUpload,
} from "@theredhead/ui-kit";

import {
  provideFormFields,
  type FormFieldRegistration,
} from "./field-registry";

/**
 * Built-in field registrations that map common component keys
 * to `@theredhead/ui-kit` components.
 *
 * | Key             | Component           | Model property |
 * |-----------------|---------------------|----------------|
 * | `"text"`        | `UIInput`           | `value`        |
 * | `"select"`      | `UISelect`          | `value`        |
 * | `"checkbox"`    | `UICheckbox`        | `checked`      |
 * | `"toggle"`      | `UIToggle`          | `value`        |
 * | `"radio"`       | `UIRadioGroup`      | `value`        |
 * | `"autocomplete"`| `UIAutocomplete`    | `value`        |
 * | `"date"`        | `UIDatePicker`      | `value`        |
 * | `"time"`        | `UITimePicker`      | `value`        |
 * | `"datetime"`    | `UIDateTimePicker`  | `value`        |
 * | `"color"`       | `UIColorPicker`     | `value`        |
 * | `"slider"`      | `UISlider`          | `value`        |
 * | `"richtext"`    | `UIRichTextEditor`  | `value`        |
 * | `"file"`        | `UIFileUpload`      | `files`        |
 */
export const BUILT_IN_FIELDS: Readonly<Record<string, FormFieldRegistration>> =
  {
    text: { component: UIInput, modelProperty: "value" },
    select: { component: UISelect, modelProperty: "value" },
    checkbox: { component: UICheckbox, modelProperty: "checked" },
    toggle: { component: UIToggle, modelProperty: "value" },
    radio: { component: UIRadioGroup, modelProperty: "value" },
    autocomplete: { component: UIAutocomplete, modelProperty: "value" },
    date: { component: UIDatePicker, modelProperty: "value" },
    time: { component: UITimePicker, modelProperty: "value" },
    datetime: { component: UIDateTimePicker, modelProperty: "value" },
    color: { component: UIColorPicker, modelProperty: "value" },
    slider: { component: UISlider, modelProperty: "value" },
    richtext: { component: UIRichTextEditor, modelProperty: "value" },
    file: { component: UIFileUpload, modelProperty: "files" },
  };

/**
 * Convenience provider that registers all built-in
 * `@theredhead/ui-kit` field types.
 *
 * @example
 * ```ts
 * import { provideBuiltInFormFields } from '@theredhead/ui-forms';
 *
 * export const appConfig = {
 *   providers: [provideBuiltInFormFields()],
 * };
 * ```
 */
export function provideBuiltInFormFields(): EnvironmentProviders {
  return provideFormFields(BUILT_IN_FIELDS);
}
