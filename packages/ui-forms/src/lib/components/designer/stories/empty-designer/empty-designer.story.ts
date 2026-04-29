import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIFormDesigner],
  template: \`
    <div style="height: 700px">
      <ui-form-designer (schemaChange)="onSave($event)" />
    </div>
  \`,
})
export class ExampleComponent {
  onSave(schema: FormSchema): void {
    console.log('Exported schema:', schema);
  }
}
