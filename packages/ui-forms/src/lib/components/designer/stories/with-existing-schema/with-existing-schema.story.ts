import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIFormDesigner],
  template: \`
    <div style="height: 700px">
      <ui-form-designer
        [schema]="existingSchema"
        (schemaChange)="onSave($event)"
      />
    </div>
  \`,
})
export class ExampleComponent {
  existingSchema: FormSchema = {
    id: 'contact',
    title: 'Contact Form',
    groups: [
      {
        id: 'main',
        fields: [
          { id: 'name', title: 'Name', component: 'text' },
          { id: 'email', title: 'Email', component: 'text',
            config: { type: 'email' } },
        ],
      },
    ],
  };

  onSave(schema: FormSchema): void {
    console.log('Updated schema:', schema);
  }
}
