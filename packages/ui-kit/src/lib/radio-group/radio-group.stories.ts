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
  decorators: [
    moduleMetadata({
      imports: [UIRadioButton, RadioDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIRadioGroup>;

/** Default radio group. */
export const Default: Story = {
  render: () => ({
    template: `<ui-radio-demo />`,
  }),
  parameters: {
    docs: {
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

/** With pre-selected value. */
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
};

/** With disabled individual items. */
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
};

/** Entire group disabled. */
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
};
