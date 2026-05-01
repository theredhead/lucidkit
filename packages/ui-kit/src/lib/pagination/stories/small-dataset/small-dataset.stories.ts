import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { SmallDatasetStorySource } from "./small-dataset.story";

const meta = {
  title: "@theredhead/UI Kit/Pagination",
  component: SmallDatasetStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pagination control for navigating paged datasets. Displays " +
          "page buttons, prev/next navigation, and an optional page-size selector.",
      },
    },
  },
  argTypes: {
    totalItems: {
      control: "number",
      description:
        "Total number of items in the dataset. Used to calculate " +
        "page count (`Math.ceil(totalItems / pageSize)`).",
    },
    pageSize: {
      control: "number",
      description:
        "Number of items displayed per page. Can be changed at " +
        "runtime via the page-size dropdown.",
    },
    disabled: {
      control: "boolean",
      description: "Disables all pagination controls, preventing page changes.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [SmallDatasetStorySource] })],
} satisfies Meta<SmallDatasetStorySource>;

export default meta;
type Story = StoryObj<SmallDatasetStorySource>;

export const SmallDataset: Story = {
  args: {
    totalItems: 30,
    pageSize: 10,
    disabled: false,
    ariaLabel: "Pagination",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-small-dataset-story-demo
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
