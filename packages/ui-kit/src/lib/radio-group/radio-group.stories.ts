import { Component, signal } from "@angular/core";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";

import { UIRadioGroup } from "./radio-group.component";
import { UIRadioButton } from "./radio-button.component";

@Component({
  selector: "ui-radio-demo",
  standalone: true,
  imports: [UIRadioGroup, UIRadioButton],
  template: `
    <ui-radio-group [name]="'fruit'" [(value)]="selected">
      <ui-radio-button [value]="'apple'">Apple</ui-radio-button>
      <ui-radio-button [value]="'banana'">Banana</ui-radio-button>
      <ui-radio-button [value]="'cherry'">Cherry</ui-radio-button>
    </ui-radio-group>
    <p style="margin-top: 12px; font-size: 0.875rem; color: #666;">
      Selected: {{ selected() ?? "none" }}
    </p>
  `,
})
class RadioDemo {
  public readonly selected = signal<string | undefined>(undefined);
}

const meta: Meta<UIRadioGroup> = {
  title: "@Theredhead/UI Kit/Radio Group",
  component: UIRadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A group of mutually exclusive radio buttons. Only one option " +
          "can be selected at a time.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UIRadioButton, RadioDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIRadioGroup>;

/**
 * Interactive radio group with three fruit options. The selected
 * value is displayed below the group and updates via two-way binding.
 * Click a radio button or use arrow keys to change the selection.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-radio-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Composition\n" +
          "`UIRadioGroup` wraps one or more `UIRadioButton` children. The " +
          "group manages selection state and keyboard navigation (arrow keys).\n\n" +
          "### Features\n" +
          "- **Two-way binding** — `[(value)]` model signal on the group\n" +
          "- **Individual disable** — disable specific options with `[disabled]` on `UIRadioButton`\n" +
          "- **Group disable** — disable the entire group with `[disabled]` on `UIRadioGroup`\n" +
          '- **Accessible** — proper `role="radiogroup"` with arrow-key navigation\n\n' +
          "### Usage\n" +
          "```html\n" +
          '<ui-radio-group name="plan" [(value)]="selectedPlan">\n' +
          '  <ui-radio-button value="free">Free</ui-radio-button>\n' +
          '  <ui-radio-button value="pro">Pro</ui-radio-button>\n' +
          "</ui-radio-group>\n" +
          "```",
      },
      source: {
        code: `<ui-radio-group [name]="'fruit'" [(value)]="selected">
  <ui-radio-button [value]="'apple'">Apple</ui-radio-button>
  <ui-radio-button [value]="'banana'">Banana</ui-radio-button>
  <ui-radio-button [value]="'cherry'">Cherry</ui-radio-button>
</ui-radio-group>

<!-- Component class:
readonly selected = signal<string | undefined>(undefined); -->`,
        language: "html",
      },
    },
  },
};

/**
 * A radio group with a pre-selected initial value (`green`). The
 * component renders the correct radio button as checked on first paint.
 */
export const PreSelected: Story = {
  render: () => ({
    template: `
      <ui-radio-group [name]="'color'" [value]="'green'">
        <ui-radio-button [value]="'red'">Red</ui-radio-button>
        <ui-radio-button [value]="'green'">Green</ui-radio-button>
        <ui-radio-button [value]="'blue'">Blue</ui-radio-button>
      </ui-radio-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          "<ui-radio-group [name]=\"'color'\" [value]=\"'green'\">",
          "  <ui-radio-button [value]=\"'red'\">Red</ui-radio-button>",
          "  <ui-radio-button [value]=\"'green'\">Green</ui-radio-button>",
          "  <ui-radio-button [value]=\"'blue'\">Blue</ui-radio-button>",
          "</ui-radio-group>",
          "",
          "// ── TypeScript ──",
          'import { UIRadioGroup, UIRadioButton } from "@theredhead/ui-kit";',
          "",
          "@Component({",
          "  imports: [UIRadioGroup, UIRadioButton],",
          "})",
          "",
          "// ── SCSS ──",
          "// No custom styles required.",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * Individual radio buttons can be disabled while the rest remain
 * interactive. Here the "Enterprise" option is greyed out.
 */
export const DisabledItem: Story = {
  render: () => ({
    template: `
      <ui-radio-group [name]="'plan'">
        <ui-radio-button [value]="'free'">Free</ui-radio-button>
        <ui-radio-button [value]="'pro'">Pro</ui-radio-button>
        <ui-radio-button [value]="'enterprise'" [disabled]="true">Enterprise (contact us)</ui-radio-button>
      </ui-radio-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          "<ui-radio-group [name]=\"'plan'\">",
          "  <ui-radio-button [value]=\"'free'\">Free</ui-radio-button>",
          "  <ui-radio-button [value]=\"'pro'\">Pro</ui-radio-button>",
          '  <ui-radio-button [value]="\'enterprise\'" [disabled]="true">Enterprise (contact us)</ui-radio-button>',
          "</ui-radio-group>",
          "",
          "// ── TypeScript ──",
          'import { UIRadioGroup, UIRadioButton } from "@theredhead/ui-kit";',
          "",
          "@Component({",
          "  imports: [UIRadioGroup, UIRadioButton],",
          "})",
          "",
          "// ── SCSS ──",
          "// No custom styles required.",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * The entire group is disabled, preventing any selection changes.
 * The previously selected value (\"md\") remains visible but
 * non-interactive.
 */
export const DisabledGroup: Story = {
  render: () => ({
    template: `
      <ui-radio-group [name]="'size'" [value]="'md'" [disabled]="true">
        <ui-radio-button [value]="'sm'">Small</ui-radio-button>
        <ui-radio-button [value]="'md'">Medium</ui-radio-button>
        <ui-radio-button [value]="'lg'">Large</ui-radio-button>
      </ui-radio-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          '<ui-radio-group [name]="\'size\'" [value]="\'md\'" [disabled]="true">',
          "  <ui-radio-button [value]=\"'sm'\">Small</ui-radio-button>",
          "  <ui-radio-button [value]=\"'md'\">Medium</ui-radio-button>",
          "  <ui-radio-button [value]=\"'lg'\">Large</ui-radio-button>",
          "</ui-radio-group>",
          "",
          "// ── TypeScript ──",
          'import { UIRadioGroup, UIRadioButton } from "@theredhead/ui-kit";',
          "",
          "@Component({",
          "  imports: [UIRadioGroup, UIRadioButton],",
          "})",
          "",
          "// ── SCSS ──",
          "// No custom styles required.",
        ].join("\n"),
        language: "html",
      },
    },
  },
};
