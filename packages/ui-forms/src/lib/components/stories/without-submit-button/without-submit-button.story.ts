import { Component } from '@angular/core';
import { UIForm, FormEngine } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-inline-form',
  standalone: true,
  imports: [UIForm],
  template: `
    <ui-form [engine]="engine" [showSubmit]="false" />
    <footer>
      <button [disabled]="!engine.valid()" (click)="save()">
        Save changes
      </button>
    </footer>
  `,
})
export class InlineFormComponent {
  readonly engine = new FormEngine(mySchema);

  save(): void {
    if (this.engine.valid()) {
      const values = this.engine.output()();
      console.log('Saving:', values);
    }
  }
}
