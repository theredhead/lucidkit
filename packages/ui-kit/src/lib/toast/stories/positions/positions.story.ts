import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UIToastContainer],
  template: `
    <ui-toast-container position="top-right" />
    <ui-toast-container position="bottom-center" />
  `,
})
export class AppComponent {
  private readonly toast = inject(ToastService);

  notify() {
    // Toasts appear in the matching container
    this.toast.info('Top right toast', { position: 'top-right' });
    this.toast.success('Bottom center toast', { position: 'bottom-center' });
  }
}
