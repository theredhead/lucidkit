import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  UIDropdownList,
  UIDropdownListPanel,
  type SelectOption,
} from "./dropdown-list.component";

// ── Demo wrapper ──────────────────────────────────────────────────

const FRUIT_OPTIONS: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "dragonfruit", label: "Dragonfruit" },
  { value: "elderberry", label: "Elderberry" },
];

@Component({
  selector: "ui-dropdown-list-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 20rem;
      }
      .output {
        font-size: 0.8125rem;
        opacity: 0.7;
      }
    `,
  ],
  template: `
    <ui-dropdown-list
      [options]="options"
      [(value)]="selected"
      ariaLabel="Choose a fruit"
    />
    <p class="output">Selected: {{ selected() || "(none)" }}</p>
  `,
})
class UIDropdownListDemo {
  protected readonly options = FRUIT_OPTIONS;
  protected readonly selected = signal("");
}

@Component({
  selector: "ui-dropdown-list-preselected-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 20rem;
      }
      .output {
        font-size: 0.8125rem;
        opacity: 0.7;
      }
    `,
  ],
  template: `
    <ui-dropdown-list
      [options]="options"
      [(value)]="selected"
      ariaLabel="Choose a fruit"
    />
    <p class="output">Selected: {{ selected() }}</p>
  `,
})
class UIDropdownListPreselectedDemo {
  protected readonly options = FRUIT_OPTIONS;
  protected readonly selected = signal("cherry");
}

@Component({
  selector: "ui-dropdown-list-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  styles: [
    `
      :host {
        display: block;
        max-width: 20rem;
      }
    `,
  ],
  template: `
    <ui-dropdown-list
      [options]="options"
      value="banana"
      [disabled]="true"
      ariaLabel="Choose a fruit (disabled)"
    />
  `,
})
class UIDropdownListDisabledDemo {
  protected readonly options = FRUIT_OPTIONS;
}

// ── Meta ──────────────────────────────────────────────────────────

const meta: Meta<UIDropdownList> = {
  title: "@theredhead/UI Kit/Dropdown List",
  component: UIDropdownList,
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text shown when no option is selected.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the dropdown.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UIDropdownListDemo,
        UIDropdownListPreselectedDemo,
        UIDropdownListDisabledDemo,
        UIDropdownListPanel,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          "A custom dropdown that renders an outlined button with a",
          "chevron indicator. Clicking the button opens a popover",
          "(without an arrow pointer) containing a list of selectable options.",
          "",
          "API-compatible with `UISelect` — uses the same `SelectOption`",
          "interface and two-way `value` binding.",
          "",
          "## Inputs / Outputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `options` | `SelectOption[]` | *(required)* | Available options |",
          "| `value` | `string` | `''` | Two-way bound selected value |",
          "| `placeholder` | `string` | `'— Select —'` | Text when nothing is selected |",
          "| `disabled` | `boolean` | `false` | Disables the trigger button |",
          "| `ariaLabel` | `string` | — | Accessible label for the button |",
        ].join("\n"),
      },
    },
  },
};
export default meta;
type Story = StoryObj<UIDropdownList>;

// ── Stories ───────────────────────────────────────────────────────

/**
 * Interactive playground — adjust scalar inputs via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
        { label: "Mango", value: "mango" },
      ],
    },
    template: `<ui-dropdown-list
      [options]="options"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
  args: {
    placeholder: "— Select —",
    disabled: false,
    ariaLabel: "Choose a fruit",
  },
};

export const Default: Story = {
  render: () => ({
    template: `<ui-dropdown-list-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-dropdown-list
  [options]="fruitOptions"
  [(value)]="selectedFruit"
  ariaLabel="Choose a fruit"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIDropdownList } from '@theredhead/lucid-kit';
import type { SelectOption } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownList],
  template: \\\`
    <ui-dropdown-list
      [options]="fruitOptions"
      [(value)]="selectedFruit"
      ariaLabel="Choose a fruit"
    />
  \\\`,
})
export class ExampleComponent {
  readonly fruitOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
  readonly selectedFruit = signal('');
}

// ── SCSS ──
/* No custom styles needed — tokens handle theming. */
`,
      },
    },
  },
};

export const Preselected: Story = {
  render: () => ({
    template: `<ui-dropdown-list-preselected-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-dropdown-list
  [options]="options"
  [(value)]="selected"
  ariaLabel="Choose a fruit"
/>

// ── TypeScript ──
readonly selected = signal('cherry');
`,
      },
    },
  },
};

export const Disabled: Story = {
  render: () => ({
    template: `<ui-dropdown-list-disabled-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-dropdown-list
  [options]="options"
  value="banana"
  [disabled]="true"
  ariaLabel="Disabled dropdown"
/>
`,
      },
    },
  },
};
