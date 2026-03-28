import { Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIWizard } from "./wizard.component";
import { UIWizardStep } from "./wizard-step.component";

@Component({
  selector: "ui-story-wizard-basic",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: `
    <div
      style="height: 400px; color: var(--ui-text, #1d232b); background: var(--ui-surface, #ffffff); padding: 16px;"
    >
      <ui-wizard (complete)="onComplete()">
        <ui-wizard-step label="Account">
          <h3>Create your account</h3>
          <p>Enter your email address and choose a password.</p>
        </ui-wizard-step>
        <ui-wizard-step label="Profile" [optional]="true">
          <h3>Set up your profile</h3>
          <p>Choose a display name and upload an avatar.</p>
        </ui-wizard-step>
        <ui-wizard-step label="Confirm">
          <h3>Confirm your details</h3>
          <p>Review your information and click Finish.</p>
        </ui-wizard-step>
      </ui-wizard>
    </div>
  `,
})
class BasicWizardStory {
  public onComplete(): void {
    alert("Wizard completed!");
  }
}

@Component({
  selector: "ui-story-wizard-validation",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: `
    <div
      style="height: 400px; color: var(--ui-text, #1d232b); background: var(--ui-surface, #ffffff); padding: 16px;"
    >
      <ui-wizard [linear]="true" (complete)="onComplete()">
        <ui-wizard-step label="Terms" [canAdvance]="accepted()">
          <h3>Accept the Terms</h3>
          <p>You must accept the terms to continue.</p>
          <label
            style="display: flex; align-items: center; gap: 8px; margin-top: 16px;"
          >
            <input
              type="checkbox"
              [checked]="accepted()"
              (change)="accepted.set(!accepted())"
            />
            I accept the terms and conditions
          </label>
        </ui-wizard-step>
        <ui-wizard-step label="Details">
          <h3>Enter your details</h3>
          <p>This step has no validation gate — you can proceed freely.</p>
        </ui-wizard-step>
        <ui-wizard-step label="Complete">
          <h3>All done!</h3>
          <p>Click Finish to complete the wizard.</p>
        </ui-wizard-step>
      </ui-wizard>
    </div>
  `,
})
class ValidationWizardStory {
  public readonly accepted = signal(false);

  public onComplete(): void {
    alert("Wizard completed with validation!");
  }
}

const meta: Meta<UIWizard> = {
  title: "@theredhead/UI Blocks/Wizard",
  component: UIWizard,
  tags: ["autodocs"],
  argTypes: {
    linear: {
      control: "boolean",
      description: "Enforce sequential step completion.",
    },
    showStepIndicator: {
      control: "boolean",
      description: "Show the step indicator bar.",
    },
    backLabel: {
      control: "text",
      description: "Label for the Back button.",
    },
    nextLabel: {
      control: "text",
      description: "Label for the Next button.",
    },
    finishLabel: {
      control: "text",
      description: "Label for the Finish button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the wizard.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [BasicWizardStory, ValidationWizardStory],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIWizard>;

export const Default: Story = {
  render: () => ({
    template: `<ui-story-wizard-basic />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-wizard (complete)="onFinish()">
  <ui-wizard-step label="Account">…</ui-wizard-step>
  <ui-wizard-step label="Profile" [optional]="true">…</ui-wizard-step>
  <ui-wizard-step label="Confirm">…</ui-wizard-step>
</ui-wizard>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIWizard, UIWizardStep } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: \\\`
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
  \\\`,
})
export class OnboardingComponent {
  onFinish(): void { console.log('Done!'); }
}

// ── SCSS ──
/* No custom styles needed — wizard tokens handle theming. */
`,
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => ({
    template: `<ui-story-wizard-validation />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-wizard [linear]="true" (complete)="onFinish()">
  <ui-wizard-step label="Terms" [canAdvance]="accepted()">
    <label>
      <input type="checkbox" [checked]="accepted()" (change)="accepted.set(!accepted())" />
      I accept the terms
    </label>
  </ui-wizard-step>
  <ui-wizard-step label="Details">…</ui-wizard-step>
  <ui-wizard-step label="Complete">…</ui-wizard-step>
</ui-wizard>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIWizard, UIWizardStep } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: \\\`…\\\`,
})
export class SignupComponent {
  readonly accepted = signal(false);
  onFinish(): void { console.log('Done!'); }
}

// ── SCSS ──
/* No custom styles needed */
`,
      },
    },
  },
};
