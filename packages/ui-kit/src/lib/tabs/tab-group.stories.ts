import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITabGroup } from "./tab-group.component";
import { UITab } from "./tab.component";

const meta: Meta<UITabGroup> = {
  title: "@Theredhead/UI Kit/Tabs",
  component: UITabGroup,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [UITab],
    }),
  ],
};

export default meta;
type Story = StoryObj<UITabGroup>;

/** Default three tabs. */
export const Default: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Overview">
          <p>This is the overview panel.</p>
        </ui-tab>
        <ui-tab label="Details">
          <p>Detailed information goes here.</p>
        </ui-tab>
        <ui-tab label="History">
          <p>History log content.</p>
        </ui-tab>
      </ui-tab-group>
    `,
  }),
};

/** Start on second tab. */
export const SecondTabSelected: Story = {
  render: () => ({
    template: `
      <ui-tab-group [selectedIndex]="1">
        <ui-tab label="First">First content</ui-tab>
        <ui-tab label="Second">Second content — initially active</ui-tab>
        <ui-tab label="Third">Third content</ui-tab>
      </ui-tab-group>
    `,
  }),
};

/** With a disabled tab. */
export const DisabledTab: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Active">Active tab content</ui-tab>
        <ui-tab label="Disabled" [disabled]="true">This won't show</ui-tab>
        <ui-tab label="Also Active">Another active tab</ui-tab>
      </ui-tab-group>
    `,
  }),
};

/** Many tabs. */
export const ManyTabs: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Tab 1"><p>Content 1</p></ui-tab>
        <ui-tab label="Tab 2"><p>Content 2</p></ui-tab>
        <ui-tab label="Tab 3"><p>Content 3</p></ui-tab>
        <ui-tab label="Tab 4"><p>Content 4</p></ui-tab>
        <ui-tab label="Tab 5"><p>Content 5</p></ui-tab>
        <ui-tab label="Tab 6"><p>Content 6</p></ui-tab>
      </ui-tab-group>
    `,
  }),
};
