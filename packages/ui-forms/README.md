# @theredhead/lucid-forms

Schema-driven, signal-based Angular form engine with validation, conditional
logic, and a visual form designer. Part of the **LucidKit** UI library family.

---

## Installation

```bash
npm install @theredhead/lucid-forms @theredhead/lucid-kit @theredhead/lucid-foundation
```

---

## Overview

`@theredhead/lucid-forms` lets you define forms as plain JSON/TypeScript objects
and renders them using `@theredhead/lucid-kit` components. No template boilerplate,
no `FormGroup` wiring — just a schema and a binding.

### Key features

- **Schema-driven** — describe fields, groups, validation, and defaults in a `FormSchema` object
- **Dynamic field rendering** — maps field types (`text`, `select`, `checkbox`, `date`, …) to
  the correct `@theredhead/lucid-kit` component automatically
- **Conditional logic** — show/hide or enable/disable fields based on other field values
- **Validation** — `required`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `email` rules
  with per-field error messages
- **Form designer** — drag-and-drop `UIFormDesigner` component for building schemas visually at runtime
- **Signal-based** — fully zoneless, all state communicated via Angular signals

---

## Quick start

```typescript
import { Component } from '@angular/core';
import { UIFormView } from '@theredhead/lucid-forms';
import { provideBuiltInFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIFormView],
  providers: [provideBuiltInFields()],
  template: `
    <ui-form-view
      [schema]="schema"
      [(values)]="values"
    />
  `,
})
export class ExampleComponent {
  schema: FormSchema = {
    groups: [
      {
        label: 'Personal details',
        fields: [
          { key: 'name',  label: 'Full name',  type: 'text',     validation: [{ type: 'required' }] },
          { key: 'email', label: 'Email',       type: 'text',     validation: [{ type: 'email' }] },
          { key: 'role',  label: 'Role',        type: 'select',
            options: [
              { value: 'admin', label: 'Admin' },
              { value: 'user',  label: 'User' },
            ]
          },
        ],
      },
    ],
  };

  values: FormValues = {};
}
```

---

## Built-in field types

| Key            | Component rendered        | Notes                             |
|----------------|---------------------------|-----------------------------------|
| `text`         | `UIInput`                 | Plain text, email, number, etc.   |
| `select`       | `UIDropdownList`          | Requires `options` on the field   |
| `checkbox`     | `UICheckbox`              |                                   |
| `toggle`       | `UIToggle`                |                                   |
| `radio`        | `UIRadioGroup`            | Requires `options` on the field   |
| `autocomplete` | `UIAutocomplete`          |                                   |
| `date`         | `UIInput` + date adapter  |                                   |
| `time`         | `UIInput` + time adapter  |                                   |
| `datetime`     | `UIInput` + date adapter  |                                   |
| `color`        | `UIColorPicker`           |                                   |
| `slider`       | `UISlider`                |                                   |
| `richtext`     | `UIRichTextEditor`        |                                   |
| `file`         | `UIFileUpload`            |                                   |

Custom field types can be registered via `provideFormFields()`.

---

## Peer dependencies

| Package                          | Version   |
|----------------------------------|-----------|
| `@angular/core`                  | `^21.0.0` |
| `@angular/common`                | `^21.0.0` |
| `@theredhead/lucid-foundation`   | `^0.0.1`  |
| `@theredhead/lucid-kit`          | `^0.0.1`  |
