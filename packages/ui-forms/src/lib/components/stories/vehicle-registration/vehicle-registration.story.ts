import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/lucid-forms';
import type { FormSchema, FormValues } from '@theredhead/lucid-forms';

const schema: FormSchema = {
  id: 'vehicle-registration',
  title: 'Vehicle Registration',
  description: 'Complete this form to register your vehicle.',
  groups: [
    {
      id: 'intro',
      title: 'Welcome',
      fields: [
        // Flair: rich text introduction (no data collected)
        { id: 'intro-text', title: '', component: 'flair:richtext',
          config: { content: '<h3>Vehicle Registration</h3><p>Please fill out all sections.</p>' } },
        // Flair: banner image (no data collected)
        { id: 'intro-image', title: '', component: 'flair:image',
          config: { src: 'https://example.com/vehicle.jpg', alt: 'Vehicle', width: 800, height: 240 } },
      ],
    },
    {
      id: 'vehicle',
      title: 'Vehicle Information',
      fields: [
        { id: 'make', title: 'Make', component: 'select',
          options: [
            { label: 'Ford', value: 'ford' },
            { label: 'Toyota', value: 'toyota' },
          ],
          validation: [{ type: 'required' }] },
        { id: 'model', title: 'Model', component: 'text',
          validation: [{ type: 'required' }] },
        { id: 'year', title: 'Year', component: 'text',
          defaultValue: '2024', config: { type: 'number' } },
        { id: 'bodyType', title: 'Body Type', component: 'radio',
          options: [
            { label: 'Sedan', value: 'sedan' },
            { label: 'SUV', value: 'suv' },
          ] },
        { id: 'color', title: 'Exterior Color', component: 'color', config: { initialMode: 'named', availableModes: ['named'] } },
        { id: 'vin', title: 'VIN', component: 'text',
          config: { textAdapter: 'uppercase' },
          validation: [{ type: 'required' },
            { type: 'pattern', params: { pattern: '^[A-HJ-NPR-Z0-9]{17}$' },
              message: 'VIN must be 17 uppercase alphanumeric characters.' }] },
      ],
    },
    {
      id: 'registration',
      title: 'Registration Details',
      fields: [
        { id: 'registrationType', title: 'Type', component: 'select',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Renewal', value: 'renewal' },
          ] },
        // Conditional: only visible for renewals
        { id: 'previousPlate', title: 'Previous Plate', component: 'text',
          visibleWhen: { field: 'registrationType', operator: 'in', value: ['renewal'] } },
        { id: 'hasInsurance', title: 'I have insurance', component: 'toggle' },
        // Conditional: only visible when insured
        { id: 'insuranceCompany', title: 'Insurer', component: 'text',
          visibleWhen: { field: 'hasInsurance', operator: 'equals', value: true } },
      ],
    },
    {
      id: 'consent',
      title: 'Declaration',
      fields: [
        { id: 'notice', title: '', component: 'flair:richtext',
          config: { content: '<p><em>I declare all information is accurate.</em></p>' } },
        { id: 'agree', title: 'I agree to the terms', component: 'checkbox',
          validation: [{ type: 'required' }] },
      ],
    },
  ],
};

@Component({
  selector: 'app-vehicle-reg',
  standalone: true,
  imports: [UIForm],
  template: `
    <ui-form
      [engine]="engine"
      submitLabel="Submit Registration"
      (formSubmit)="onSubmit($event)"
    />
  `,
})
export class VehicleRegComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Registration:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]
