import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIToastContainer],
  template: `
    <button (click)="deleteWithUndo()">Delete Item</button>
    <button (click)="showPersistent()">Persistent Error</button>
    <ui-toast-container />
  `,
})
export class ExampleComponent {
  private readonly toast = inject(ToastService);

  deleteWithUndo() {
    this.toast.success('Item deleted', {
      actionLabel: 'Undo',
      actionFn: () => this.toast.info('Undo successful!'),
    });
  }

  showPersistent() {
    // duration: 0 keeps the toast until manually dismissed
    this.toast.error('Connection lost.', { duration: 0 });
  }
}
