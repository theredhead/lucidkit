import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-vehicle-designer',
  standalone: true,
  imports: [UIFormDesigner],
  template: \`
    <div style="height: 700px">
      <ui-form-designer
        [schema]="vehicleSchema"
        (schemaChange)="onSave($event)"
      />
    </div>
  \`,
})
export class VehicleDesignerComponent {
  // Pre-loaded schema with flair elements, conditional fields,
  // and diverse field types.
  vehicleSchema: FormSchema = {
    id: 'vehicle-registration',
    title: 'Vehicle Registration',
    groups: [
      {
        id: 'intro',
        title: 'Welcome',
        fields: [
          { id: 'intro-text', title: '', component: 'flair:richtext',
            config: { content: '<h3>Vehicle Registration</h3><p>Fill out all sections.</p>' } },
          { id: 'intro-image', title: '', component: 'flair:image',
            config: { src: 'https://example.com/car.jpg', alt: 'Car', width: 800, height: 240 } },
        ],
      },
      {
        id: 'vehicle',
        title: 'Vehicle Info',
        fields: [
          { id: 'make', title: 'Make', component: 'select',
            options: [{ label: 'Ford', value: 'ford' }, { label: 'Toyota', value: 'toyota' }],
            validation: [{ type: 'required' }] },
          { id: 'vin', title: 'VIN', component: 'text',
            config: { textAdapter: 'uppercase' },
            validation: [{ type: 'required' },
              { type: 'pattern', params: { pattern: '^[A-HJ-NPR-Z0-9]{17}$' } }] },
          { id: 'color', title: 'Exterior Color', component: 'color', config: { initialMode: 'named', availableModes: ['named'] } },
        ],
      },
      // ... additional groups for owner, registration, documents, consent
    ],
  };

  onSave(schema: FormSchema): void {
    console.log('Updated schema:', schema);
  }
}
