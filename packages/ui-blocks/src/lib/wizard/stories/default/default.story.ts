import { Component } from '@angular/core';
import { UIWizard, UIWizardStep } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: \`
    <ui-wizard (complete)="onFinish()">
      <ui-wizard-step label="Account">
        <h3>Create your account</h3>
      </ui-wizard-step>
      <ui-wizard-step label="Profile" [optional]="true">
        <h3>Set up your profile</h3>
      </ui-wizard-step>
      <ui-wizard-step label="Confirm">
        <h3>Confirm details</h3>
      </ui-wizard-step>
    </ui-wizard>
  \`,
})
export class OnboardingComponent {
  onFinish(): void { console.log('Done!'); }
}
