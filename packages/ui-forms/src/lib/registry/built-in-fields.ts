// ── Built-in field registrations for @theredhead/lucid-kit ──────────────

import type { EnvironmentProviders } from "@angular/core";

import {
  UIInput,
  UIDropdownList,
  UICheckbox,
  UIToggle,
  UIRadioGroup,
  UIRichTextView,
  UIAutocomplete,
  DateInputAdapter,
  TimeTextAdapter,
  UIColorPicker,
  UISlider,
  UIRichTextEditor,
  UIFileUpload,
  UIImage,
  UIMediaPlayer,
  UISignature,
} from "@theredhead/lucid-kit";

import {
  provideFormFields,
  type FormFieldRegistration,
} from "./field-registry";
import { resolveTextAdapter } from "./text-adapter-resolver";

/**
 * Built-in field registrations that map common component keys
 * to `@theredhead/lucid-kit` components.
 *
 * | Key             | Component           | Model property |
 * |-----------------|---------------------|----------------|
 * | `"text"`        | `UIInput`           | `value`        |
 * | `"select"`      | `UIDropdownList`    | `value`        |
 * | `"checkbox"`    | `UICheckbox`        | `checked`      |
 * | `"toggle"`      | `UIToggle`          | `value`        |
 * | `"radio"`       | `UIRadioGroup`      | `value`        |
 * | `"autocomplete"`| `UIAutocomplete`    | `value`        |
 * | `"date"`        | `UIInput` + `DateInputAdapter`  | `value` |
 * | `"time"`        | `UIInput` + `TimeTextAdapter`   | `value` |
 * | `"datetime"`    | `UIInput` + `DateInputAdapter`  | `value` |
 * | `"color"`       | `UIColorPicker`     | `value`        |
 * | `"slider"`      | `UISlider`          | `value`        |
 * | `"richtext"`    | `UIRichTextEditor`  | `value`        |
 * | `"file"`        | `UIFileUpload`      | `files`        |
 * | `"signature"`   | `UISignature`       | `value`        |
 * | `"flair:richtext"` | `UIRichTextView`   | `content`       |
 * | `"flair:image"` | `UIImage`           | `src`          |
 * | `"flair:media"` | `UIMediaPlayer`     | `source`       |
 */
export const BUILT_IN_FIELDS: Readonly<Record<string, FormFieldRegistration>> =
  {
    text: {
      component: UIInput,
      modelProperty: "value",
      configTransforms: {
        textAdapter: {
          inputKey: "adapter",
          transform: resolveTextAdapter,
        },
      },
    },
    select: { component: UIDropdownList, modelProperty: "value" },
    checkbox: { component: UICheckbox, modelProperty: "checked" },
    toggle: { component: UIToggle, modelProperty: "value" },
    radio: { component: UIRadioGroup, modelProperty: "value" },
    autocomplete: { component: UIAutocomplete, modelProperty: "value" },
    date: {
      component: UIInput,
      modelProperty: "value",
      defaultConfig: { adapter: new DateInputAdapter() },
    },
    time: {
      component: UIInput,
      modelProperty: "value",
      defaultConfig: { adapter: new TimeTextAdapter() },
    },
    datetime: {
      component: UIInput,
      modelProperty: "value",
      defaultConfig: { adapter: new DateInputAdapter() },
    },
    color: { component: UIColorPicker, modelProperty: "value" },
    slider: {
      component: UISlider,
      modelProperty: "value",
      defaultConfig: { showValue: true, showMinMax: true },
    },
    richtext: { component: UIRichTextEditor, modelProperty: "value" },
    file: { component: UIFileUpload, modelProperty: "files" },
    signature: { component: UISignature, modelProperty: "value" },
    "flair:richtext": {
      component: UIRichTextView,
      modelProperty: "content",
    },
    "flair:image": { component: UIImage, modelProperty: "src" },
    "flair:media": {
      component: UIMediaPlayer,
      modelProperty: "source",
      defaultConfig: { controls: true },
    },
  };

/**
 * Convenience provider that registers all built-in
 * `@theredhead/lucid-kit` field types.
 *
 * @example
 * ```ts
 * import { provideBuiltInFormFields } from '@theredhead/lucid-forms';
 *
 * export const appConfig = {
 *   providers: [provideBuiltInFormFields()],
 * };
 * ```
 */
export function provideBuiltInFormFields(): EnvironmentProviders {
  return provideFormFields(BUILT_IN_FIELDS);
}
