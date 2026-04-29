import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

const schema: FormSchema = {
  id: 'contact',
  title: 'Contact Form',
  description: 'Fill in your details and we will get back to you.',
  groups: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: [
        { id: 'firstName', title: 'First Name', component: 'text',
          validation: [{ type: 'required' }] },
        { id: 'lastName', title: 'Last Name', component: 'text',
          validation: [{ type: 'required' }] },
        { id: 'email', title: 'E-mail', component: 'text',
          description: "We'll never share your email with anyone.",
          validation: [{ type: 'required' }, { type: 'email' }] },
      ],
    },
    {
      id: 'message',
      title: 'Your Message',
      fields: [
        { id: 'subject', title: 'Subject', component: 'select',
          config: { options: [
            { label: 'General inquiry', value: 'general' },
            { label: 'Bug report', value: 'bug' },
            { label: 'Feature request', value: 'feature' },
          ]},
          validation: [{ type: 'required' }] },
        { id: 'body', title: 'Message', component: 'text',
          config: { multiline: true, rows: 4 },
          validation: [{ type: 'required' }, { type: 'minLength', params: { min: 10 } }] },
      ],
    },
  ],
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UIForm],
  template: `
    <ui-form
      [engine]="engine"
      submitLabel="Send message"
      (formSubmit)="onSubmit($event)"
    />
  `,
})
export class ContactComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Submitted:', values); }
}

// In app.config.ts — register the built-in field set:
// providers: [provideBuiltInFormFields()]
