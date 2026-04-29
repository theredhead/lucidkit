import { Component, signal } from '@angular/core';
import { UIWizard, UIWizardStep } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: \`…\`,
})
export class SignupComponent {
  readonly accepted = signal(false);
  onFinish(): void { console.log('Done!'); }
}
