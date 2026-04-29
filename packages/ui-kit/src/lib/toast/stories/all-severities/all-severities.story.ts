import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UIToastContainer],
  template: `
    <button (click)="showInfo()">Info</button>
    <button (click)="showSuccess()">Success</button>
    <button (click)="showWarning()">Warning</button>
    <button (click)="showError()">Error</button>
    <ui-toast-container />
  `,
})
export class AppComponent {
  private readonly toast = inject(ToastService);

  showInfo()    { this.toast.info('Informational message.'); }
  showSuccess() { this.toast.success('Document saved.'); }
  showWarning() { this.toast.warning('Session expiring soon.'); }
  showError()   { this.toast.error('Save failed.'); }
}
