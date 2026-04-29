import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIPagination } from "../../pagination.component";

import { NoPageSizeSelectorStorySource } from "./no-page-size-selector.story";

const meta = {
  title: "@theredhead/UI Kit/Pagination",
  component: UIPagination,
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
  decorators: [moduleMetadata({ imports: [NoPageSizeSelectorStorySource] })]
} satisfies Meta<UIPagination>;

export default meta;
type Story = StoryObj<UIPagination>;

export const NoPageSizeSelector: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    template: `<ui-pagination [totalItems]="100" [pageSize]="10" [pageSizeOptions]="[]" />`,
  })
};
