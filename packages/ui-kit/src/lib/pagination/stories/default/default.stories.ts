import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { PaginationDemo } from "./default.story";

interface PaginationStoryArgs {
  ariaLabel: string;
  disabled: boolean;
  pageChange: (event: unknown) => void;
  pageSize: number;
  totalItems: number;
}

const meta = {
  title: "@theredhead/UI Kit/Pagination",
  component: PaginationDemo,
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
    pageChange: {
      action: "pageChange",
      description: "Emitted when the current page or page size changes.",
    },
  },
  decorators: [moduleMetadata({ imports: [PaginationDemo] })],
} satisfies Meta<PaginationStoryArgs>;

export default meta;
type Story = StoryObj<PaginationStoryArgs>;

export const Default: Story = {
  args: {
    totalItems: 250,
    pageSize: 10,
    disabled: false,
    ariaLabel: "Pagination",
  },
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Two-way binding** — `[(pageIndex)]` model signal for the current page\n" +
          "- **Page-size selector** — configurable via `pageSizeOptions`; set to `[]` to hide\n" +
          "- **Ellipsis compression** — large page counts are collapsed with … markers\n" +
          '- **Disabled state** — greyed out when `[disabled]="true"`\n\n' +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `totalItems` | `number` | `0` | Total item count |\n" +
          "| `pageSize` | `number` | `10` | Items per page |\n" +
          "| `pageIndex` | `number` | `0` | Current 0-based page (model) |\n" +
          "| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Dropdown options |\n" +
          "| `disabled` | `boolean` | `false` | Disable all controls |\n\n" +
          "### Output\n" +
          "| Output | Payload | Description |\n" +
          "|--------|---------|-------------|\n" +
          "| `pageChange` | `PageChangeEvent` | Emitted on page or size change |",
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<ui-pagination-demo
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (pageChange)="pageChange($event)"
    />`,
  }),
};
