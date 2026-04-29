import { Component } from '@angular/core';
import { UIFormWizard, FormEngine, provideBuiltInFormFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

const schema: FormSchema = {
  id: 'wizard',
  title: 'Account Setup Wizard',
  description: 'Complete all steps to create your account.',
  groups: [
    {
      id: 'account',
      title: 'Account',
      description: 'Choose a username and password.',
      fields: [
        { id: 'username', title: 'Username', component: 'text',
          validation: [{ type: 'required' },
            { type: 'minLength', params: { min: 3 },
              message: 'Username must be at least 3 characters.' }] },
        { id: 'password', title: 'Password', component: 'text',
          config: { type: 'password' },
          validation: [{ type: 'required' },
            { type: 'minLength', params: { min: 8 },
              message: 'Password must be at least 8 characters.' }] },
      ],
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Tell us about yourself.',
      fields: [
        { id: 'displayName', title: 'Display Name', component: 'text',
          validation: [{ type: 'required' }] },
        { id: 'favoriteColor', title: 'Favorite Color', component: 'color' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure how you want to be notified.',
      fields: [
        { id: 'emailNotifs', title: 'Email notifications', component: 'toggle',
          defaultValue: true },
        { id: 'pushNotifs', title: 'Push notifications', component: 'toggle' },
        { id: 'digestFrequency', title: 'Digest Frequency', component: 'select',
          config: { options: [
            { label: 'Real-time', value: 'realtime' },
            { label: 'Hourly',    value: 'hourly' },
            { label: 'Daily',     value: 'daily' },
          ]},
          defaultValue: 'daily' },
      ],
    },
  ],
};

@Component({
  selector: 'app-account-setup',
  standalone: true,
  imports: [UIFormWizard],
  template: `
    <ui-form-wizard
      [engine]="engine"
      nextLabel="Continue"
      prevLabel="Go back"
      submitLabel="Create account"
      (formSubmit)="onSubmit($event)"
    />
  `,
})
export class AccountSetupComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Created:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]
