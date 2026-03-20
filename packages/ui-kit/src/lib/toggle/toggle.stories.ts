import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";
import { UIToggle } from "./toggle.component";

// ── Demo wrapper: Default ────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-default",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; font-family: system-ui, sans-serif;"
    >
      <ui-toggle [(value)]="basic">Simple toggle</ui-toggle>
      <ui-toggle [(value)]="dark" onLabel="ON" offLabel="OFF"
        >Dark mode</ui-toggle
      >
      <ui-toggle [(value)]="notify" onLabel="Yes" offLabel="No"
        >Notifications</ui-toggle
      >
      <p style="font-size: 13px; color: #888; margin: 0;">
        basic={{ basic() }}, dark={{ dark() }}, notify={{ notify() }}
      </p>
    </div>
  `,
})
class DemoToggleDefault {
  protected readonly basic = signal(false);
  protected readonly dark = signal(true);
  protected readonly notify = signal(false);
}

// ── Demo wrapper: Sizes ──────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-sizes",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 20px; font-family: system-ui, sans-serif;"
    >
      <div style="display: flex; align-items: center; gap: 12px;">
        <ui-toggle [(value)]="sm" size="sm" onLabel="ON" offLabel="OFF" />
        <span style="font-size: 13px; color: #888;">Small</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <ui-toggle [(value)]="md" size="md" onLabel="ON" offLabel="OFF" />
        <span style="font-size: 13px; color: #888;">Medium (default)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <ui-toggle [(value)]="lg" size="lg" onLabel="ON" offLabel="OFF" />
        <span style="font-size: 13px; color: #888;">Large</span>
      </div>
    </div>
  `,
})
class DemoToggleSizes {
  protected readonly sm = signal(true);
  protected readonly md = signal(true);
  protected readonly lg = signal(true);
}

// ── Demo wrapper: States ─────────────────────────────────────────────

@Component({
  selector: "ui-demo-toggle-states",
  standalone: true,
  imports: [UIToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; font-family: system-ui, sans-serif;"
    >
      <ui-toggle [(value)]="enabled" onLabel="Active" offLabel="Inactive"
        >Enabled</ui-toggle
      >
      <ui-toggle
        [value]="true"
        [disabled]="true"
        onLabel="Active"
        offLabel="Inactive"
        >Disabled (on)</ui-toggle
      >
      <ui-toggle
        [value]="false"
        [disabled]="true"
        onLabel="Active"
        offLabel="Inactive"
        >Disabled (off)</ui-toggle
      >
    </div>
  `,
})
class DemoToggleStates {
  protected readonly enabled = signal(true);
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta<UIToggle> = {
  title: "@theredhead/UI Kit/Toggle",
  component: UIToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A toggle switch with customisable on/off labels.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DemoToggleDefault, DemoToggleSizes, DemoToggleStates],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIToggle>;

/**
 * Default toggle with customisable labels. Demonstrates two-way binding
 * and both labelled and unlabelled variants.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-toggle-default />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Supports two-way binding via `[(value)]`, three sizes (`sm`, `md`, `lg`), " +
          "and optional text labels inside the track.\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `value` | `boolean` | `false` | On/off state (two-way) |\n" +
          "| `onLabel` | `string` | `''` | Label shown when on |\n" +
          "| `offLabel` | `string` | `''` | Label shown when off |\n" +
          "| `size` | `'sm' \\| 'md' \\| 'lg'` | `'md'` | Size variant |\n" +
          "| `disabled` | `boolean` | `false` | Disables interaction |\n" +
          "| `ariaLabel` | `string` | `''` | Accessible label |\n\n" +
          "### Outputs\n" +
          "| Output | Type | Description |\n" +
          "|--------|------|-------------|\n" +
          "| `valueChange` | `boolean` | Emitted when the value changes |",
      },
      source: {
        code: [
          "// ── HTML ──",
          '<ui-toggle [(value)]="darkMode" onLabel="ON" offLabel="OFF">',
          "  Dark mode",
          "</ui-toggle>",
          "",
          "// ── TypeScript ──",
          "import { Component, signal } from '@angular/core';",
          "import { UIToggle } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  selector: 'app-settings',",
          "  standalone: true,",
          "  imports: [UIToggle],",
          "  template: `",
          '    <ui-toggle [(value)]="darkMode" onLabel="ON" offLabel="OFF">',
          "      Dark mode",
          "    </ui-toggle>",
          "  `,",
          "})",
          "export class SettingsComponent {",
          "  protected readonly darkMode = signal(false);",
          "}",
          "",
          "// ── SCSS ──",
          "/* No custom styles needed — toggle tokens handle theming. */",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * Three size variants: small, medium (default), and large.
 * All shown with track labels to illustrate scaling.
 */
export const Sizes: Story = {
  render: () => ({
    template: `<ui-demo-toggle-sizes />`,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          '<ui-toggle size="sm" [(value)]="a" onLabel="ON" offLabel="OFF" />',
          '<ui-toggle size="md" [(value)]="b" onLabel="ON" offLabel="OFF" />',
          '<ui-toggle size="lg" [(value)]="c" onLabel="ON" offLabel="OFF" />',
          "",
          "// ── TypeScript ──",
          "import { Component, signal } from '@angular/core';",
          "import { UIToggle } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  selector: 'app-example',",
          "  standalone: true,",
          "  imports: [UIToggle],",
          "  template: `",
          '    <ui-toggle size="sm" [(value)]="small" onLabel="ON" offLabel="OFF" />',
          '    <ui-toggle size="md" [(value)]="medium" onLabel="ON" offLabel="OFF" />',
          '    <ui-toggle size="lg" [(value)]="large" onLabel="ON" offLabel="OFF" />',
          "  `,",
          "})",
          "export class ExampleComponent {",
          "  protected readonly small = signal(false);",
          "  protected readonly medium = signal(false);",
          "  protected readonly large = signal(false);",
          "}",
          "",
          "// ── SCSS ──",
          "/* No custom styles needed. */",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * Enabled and disabled states with custom track labels.
 */
export const States: Story = {
  render: () => ({
    template: `<ui-demo-toggle-states />`,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          '<ui-toggle [(value)]="active" onLabel="Active" offLabel="Inactive">',
          "  Feature toggle",
          "</ui-toggle>",
          "",
          "<!-- Disabled -->",
          '<ui-toggle [value]="true" [disabled]="true" onLabel="Active" offLabel="Inactive">',
          "  Locked on",
          "</ui-toggle>",
          "",
          "// ── TypeScript ──",
          "import { Component, signal } from '@angular/core';",
          "import { UIToggle } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  selector: 'app-example',",
          "  standalone: true,",
          "  imports: [UIToggle],",
          "  template: `",
          '    <ui-toggle [(value)]="active" onLabel="Active" offLabel="Inactive">',
          "      Feature toggle",
          "    </ui-toggle>",
          "  `,",
          "})",
          "export class ExampleComponent {",
          "  protected readonly active = signal(true);",
          "}",
          "",
          "// ── SCSS ──",
          "/* No custom styles needed. */",
        ].join("\n"),
        language: "html",
      },
    },
  },
};
