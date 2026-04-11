import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIThemeToggle } from "./theme-toggle.component";

// ── Gallery demo ─────────────────────────────────────────────────────

@Component({
  selector: "ui-theme-toggle-gallery-demo",
  standalone: true,
  imports: [UIThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Icon variant</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-theme-toggle variant="icon" />
          <span style="font-size: 0.8125rem; color: #888"
            >Compact icon-only toggle</span
          >
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Button variant</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-theme-toggle variant="button" />
          <span style="font-size: 0.8125rem; color: #888"
            >Icon + text label</span
          >
        </div>
      </div>
    </div>
  `,
})
class ThemeToggleGalleryDemo {}

const meta: Meta<UIThemeToggle> = {
  title: "@theredhead/UI Kit/Theme Toggle",
  component: UIThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A button that cycles between light, dark, and system theme modes.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ThemeToggleGalleryDemo],
    }),
  ],
  argTypes: {
    variant: {
      control: "radio",
      options: ["icon", "button"],
      description:
        "Visual style: `icon` for a compact icon-only button, `button` " +
        "for a wider button with a text label alongside the icon.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle button.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the native button element. " +
        'Defaults to `"Toggle theme"`.',
    },
  },
};

export default meta;
type Story = StoryObj<UIThemeToggle>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-theme-toggle
      [variant]="variant"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
  args: {
    variant: "icon",
    disabled: false,
    ariaLabel: "Toggle theme",
  },
};

/**
 * Both theme toggle variants side by side. Click either to cycle
 * through light → dark → system modes.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-theme-toggle-gallery-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### How it works\n" +
          "Clicking the toggle cycles through three states: **light → dark → " +
          "system → light**. It works in concert with `ThemeService` from " +
          "`@theredhead/lucid-theme` to apply the correct CSS class (`light-theme` " +
          "or `dark-theme`) on the `<html>` element and persist the choice in " +
          "`localStorage`.\n\n" +
          "### Variants\n" +
          "| Variant | Appearance |\n" +
          "|---------|------------|\n" +
          "| `icon` | Icon-only button (sun/moon/auto glyph) |\n" +
          "| `button` | Icon + text label showing current mode |\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<ui-theme-toggle variant="button" />\n' +
          "```",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-theme-toggle variant="icon" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIThemeToggle } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIThemeToggle],
  template: \`<ui-theme-toggle variant="icon" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
:host {
  display: inline-block;
}
`,
      },
    },
  },
};

/**
 * The `button` variant shows the current mode as a text label
 * alongside the icon. More discoverable for users who may not
 * recognise the sun/moon icons.
 */
export const ButtonVariant: Story = {
  args: {
    variant: "button",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-theme-toggle variant="button" ariaLabel="Switch theme" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIThemeToggle } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIThemeToggle],
  template: \`<ui-theme-toggle variant="button" ariaLabel="Switch theme" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
:host {
  display: inline-block;
}
`,
      },
    },
  },
};
