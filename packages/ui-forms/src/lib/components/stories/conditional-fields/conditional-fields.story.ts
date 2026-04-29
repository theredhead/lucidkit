import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

const schema: FormSchema = {
  id: 'conditional',
  title: 'Conditional Fields Demo',
  description: 'Fields appear and disappear based on your choices.',
  groups: [{
    id: 'main',
    title: 'Preferences',
    fields: [
      {
        id: 'contactMethod',
        title: 'Preferred Contact Method',
        component: 'select',
        config: { options: [
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Post',  value: 'post'  },
        ]},
        validation: [{ type: 'required' }],
      },
      {
        id: 'emailAddress',
        title: 'E-mail Address',
        component: 'text',
        // Field is only visible when contactMethod === 'email'
        visibleWhen: { field: 'contactMethod', operator: 'equals', value: 'email' },
        validation: [{ type: 'required' }, { type: 'email' }],
      },
      {
        id: 'newsletter',
        title: 'Subscribe to newsletter',
        component: 'toggle',
      },
      {
        id: 'frequency',
        title: 'Newsletter frequency',
        component: 'select',
        visibleWhen: { field: 'newsletter', operator: 'equals', value: true },
        config: { options: [
          { label: 'Daily',   value: 'daily' },
          { label: 'Weekly',  value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
        ]},
      },
    ],
  }],
};

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [UIForm],
  template: `
    <ui-form
      [engine]="engine"
      submitLabel="Save preferences"
      (formSubmit)="onSubmit($event)"
    />
  `,
})
export class PreferencesComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Saved:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]
