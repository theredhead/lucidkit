import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CheckboxVariant, UICheckbox } from "./checkbox.component";

// ── Gallery demo ─────────────────────────────────────────────────────

@Component({
  selector: "ui-checkbox-gallery-demo",
  standalone: true,
  imports: [UICheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Checkbox variant</h4>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <ui-checkbox>Unchecked</ui-checkbox>
          <ui-checkbox [checked]="true">Checked</ui-checkbox>
          <ui-checkbox [indeterminate]="true">Indeterminate</ui-checkbox>
          <ui-checkbox [disabled]="true">Disabled</ui-checkbox>
          <ui-checkbox [disabled]="true" [checked]="true"
            >Disabled checked</ui-checkbox
          >
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Switch variant</h4>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <ui-checkbox variant="switch">Switch off</ui-checkbox>
          <ui-checkbox variant="switch" [checked]="true">Switch on</ui-checkbox>
          <ui-checkbox variant="switch" [disabled]="true"
            >Disabled switch</ui-checkbox
          >
          <ui-checkbox variant="switch" [disabled]="true" [checked]="true"
            >Disabled switch on</ui-checkbox
          >
        </div>
      </div>
    </div>
  `,
})
class CheckboxGalleryDemo {}

const meta: Meta<UICheckbox> = {
  title: "@Theredhead/UI Kit/Checkbox",
  component: UICheckbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dual-purpose boolean input that renders as either a traditional " +
          "checkbox or a toggle switch.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CheckboxGalleryDemo],
    }),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["checkbox", "switch"] satisfies CheckboxVariant[],
      description:
        "Controls the visual appearance. `checkbox` renders a traditional " +
        "tick box; `switch` renders a sliding toggle.",
    },
    checked: {
      control: "boolean",
      description:
        "Two-way bindable model signal (`[(checked)]`). Represents " +
        "the on/off state of the control.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the control, preventing interaction and applying " +
        "a muted visual style.",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Shows a horizontal dash instead of a tick mark. Useful for " +
        '"select all" controls where only some children are selected. ' +
        "Only applies to the `checkbox` variant.",
    },
  },
};

export default meta;
type Story = StoryObj<UICheckbox>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-checkbox
      [variant]="variant"
      [checked]="checked"
      [disabled]="disabled"
      [indeterminate]="indeterminate"
      [ariaLabel]="ariaLabel"
    >Accept terms</ui-checkbox>`,
  }),
  args: {
    variant: "checkbox",
    checked: false,
    disabled: false,
    indeterminate: false,
    ariaLabel: "Accept terms",
  },
};

/**
 * All checkbox and switch states at a glance: unchecked, checked,
 * indeterminate, and disabled — for both visual variants.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-checkbox-gallery-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Two-way binding** via the `checked` model signal — `[(checked)]`\n" +
          '- **Switch variant** — set `variant="switch"` for iOS / Material-style toggles\n' +
          '- **Indeterminate state** — visual third state for "select all" patterns\n' +
          "- **Label projection** — text content is projected as the label\n" +
          '- **Accessible** — renders a native `<input type="checkbox">` with proper ARIA\n\n' +
          "### Usage\n" +
          "```html\n" +
          '<ui-checkbox [(checked)]="agreeToTerms">I accept the terms</ui-checkbox>\n' +
          '<ui-checkbox variant="switch" [(checked)]="darkMode">Dark mode</ui-checkbox>\n' +
          "```",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox [(checked)]="accepted">Accept terms</ui-checkbox>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly accepted = signal(false);
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/**
 * Pre-checked checkbox — demonstrates the initial `checked` state.
 */
export const Checked: Story = {
  render: () => ({
    template: `<ui-checkbox [checked]="true">This is checked</ui-checkbox>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox [(checked)]="isChecked">This is checked</ui-checkbox>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly isChecked = signal(true);
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/**
 * The indeterminate state shows a dash mark instead of a tick.
 * Commonly used for "select all" checkboxes when only a subset
 * of child items are checked.
 */
export const Indeterminate: Story = {
  render: () => ({
    template: `<ui-checkbox [indeterminate]="true">Select all</ui-checkbox>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox
  [indeterminate]="isIndeterminate()"
  [(checked)]="allSelected"
>Select all</ui-checkbox>

// ── TypeScript ──
import { Component, computed, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly allSelected = signal(false);
  protected readonly selectedCount = signal(2);
  protected readonly totalCount = signal(5);

  protected readonly isIndeterminate = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.totalCount(),
  );
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/**
 * The `switch` variant renders a sliding toggle — ideal for
 * boolean settings like "Dark mode", "Notifications", or feature flags.
 */
export const Switch: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-checkbox variant="switch" [checked]="checked">Dark mode</ui-checkbox>`,
  }),
  args: { checked: false },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox variant="switch" [(checked)]="darkMode">Dark mode</ui-checkbox>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly darkMode = signal(false);
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/** Switch checked. */
export const SwitchChecked: Story = {
  render: () => ({
    template: `<ui-checkbox variant="switch" [checked]="true">Notifications enabled</ui-checkbox>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox variant="switch" [(checked)]="notifications">Notifications enabled</ui-checkbox>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly notifications = signal(true);
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/**
 * All disabled combinations: unchecked, checked, switch off, and
 * switch on. Disabled controls display a muted appearance and
 * prevent interaction.
 */
export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ui-checkbox [disabled]="true">Disabled unchecked</ui-checkbox>
        <ui-checkbox [disabled]="true" [checked]="true">Disabled checked</ui-checkbox>
        <ui-checkbox variant="switch" [disabled]="true">Disabled switch</ui-checkbox>
        <ui-checkbox variant="switch" [disabled]="true" [checked]="true">Disabled switch on</ui-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox [disabled]="true">Disabled unchecked</ui-checkbox>
<ui-checkbox [disabled]="true" [checked]="true">Disabled checked</ui-checkbox>
<ui-checkbox variant="switch" [disabled]="true">Disabled switch</ui-checkbox>
<ui-checkbox variant="switch" [disabled]="true" [checked]="true">Disabled switch on</ui-checkbox>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};

/**
 * Complete overview of every state and variant combination.
 * Useful for visual regression testing and design review.
 */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ui-checkbox>Unchecked</ui-checkbox>
        <ui-checkbox [checked]="true">Checked</ui-checkbox>
        <ui-checkbox [indeterminate]="true">Indeterminate</ui-checkbox>
        <ui-checkbox variant="switch">Switch off</ui-checkbox>
        <ui-checkbox variant="switch" [checked]="true">Switch on</ui-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-checkbox [(checked)]="unchecked">Unchecked</ui-checkbox>
<ui-checkbox [(checked)]="checked">Checked</ui-checkbox>
<ui-checkbox [indeterminate]="true" [(checked)]="indeterminate">Indeterminate</ui-checkbox>
<ui-checkbox variant="switch" [(checked)]="switchOff">Switch off</ui-checkbox>
<ui-checkbox variant="switch" [(checked)]="switchOn">Switch on</ui-checkbox>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/ui-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly unchecked = signal(false);
  protected readonly checked = signal(true);
  protected readonly indeterminate = signal(false);
  protected readonly switchOff = signal(false);
  protected readonly switchOn = signal(true);
}

// ── SCSS ──
/* No custom styles needed — uses library defaults. */
`,
      },
    },
  },
};
