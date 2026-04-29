import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

// Validation rules live in the schema — no extra code needed.
const schema: FormSchema = {
  id: 'validation',
  title: 'Validation Demo',
  groups: [{
    id: 'main',
    title: 'All Validators',
    fields: [
      // Required
      { id: 'name', title: 'Required Field', component: 'text',
        validation: [{ type: 'required' }] },

      // Email (with custom error message)
      { id: 'email', title: 'Email', component: 'text',
        validation: [
          { type: 'required' },
          { type: 'email', message: 'Please enter a valid email address.' },
        ] },

      // String length bounds
      { id: 'bio', title: 'Bio (3–20 chars)', component: 'text',
        validation: [
          { type: 'minLength', params: { min: 3 } },
          { type: 'maxLength', params: { max: 20 } },
        ] },

      // Numeric bounds
      { id: 'age', title: 'Age (18–120)', component: 'slider',
        defaultValue: 0, config: { min: 0, max: 150 },
        validation: [
          { type: 'min', params: { min: 18 } },
          { type: 'max', params: { max: 120 } },
        ] },

      // Regex pattern
      { id: 'code', title: 'Uppercase only', component: 'text',
        validation: [{
          type: 'pattern', params: { pattern: '^[A-Z]+$' },
          message: 'Only uppercase letters are allowed.',
        }] },
    ],
  }],
};

@Component({
  selector: 'app-validation-demo',
  standalone: true,
  imports: [UIForm],
  template: `
    <ui-form
      [engine]="engine"
      submitLabel="Validate & submit"
      (formSubmit)="onSubmit($event)"
    />
  `,
})
export class ValidationDemoComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Valid:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]
