import { Component, signal } from "@angular/core";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";

import { UIPagination } from "./pagination.component";

@Component({
  selector: "ui-pagination-demo",
  standalone: true,
  imports: [UIPagination],
  template: `
    <ui-pagination
      [totalItems]="250"
      [pageSize]="10"
      [(pageIndex)]="currentPage"
    />
    <p style="margin-top: 12px; font-size: 0.875rem; color: #666;">
      Current page index: {{ currentPage() }}
    </p>
  `,
})
class PaginationDemo {
  public readonly currentPage = signal(0);
}

const meta: Meta<UIPagination> = {
  title: "@theredhead/UI Kit/Pagination",
  component: UIPagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pagination control for navigating paged datasets. Displays " +
          "page buttons, prev/next navigation, and an optional page-size selector.\n\n" +
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
  decorators: [
    moduleMetadata({
      imports: [PaginationDemo],
    }),
  ],
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
  },
};

export default meta;
type Story = StoryObj<UIPagination>;

/**
 * Interactive pagination with 250 items at 10 per page. Click page
 * buttons or prev/next arrows to navigate. The current 0-based
 * `pageIndex` is displayed below.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-pagination-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-pagination
  [totalItems]="250"
  [pageSize]="10"
  [(pageIndex)]="currentPage"
/>

<!-- Component class:
readonly currentPage = signal(0); -->`,
        language: "html",
      },
    },
  },
};

/**
 * A small dataset (30 items, 3 pages). All page numbers are visible
 * without ellipsis compression.
 */
export const SmallDataset: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="30" [pageSize]="10" />`,
  }),
};

/**
 * A large dataset (1000 items, 40 pages at 25/page). Demonstrates
 * the ellipsis (…) compression that keeps the page list compact.
 */
export const LargeDataset: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="1000" [pageSize]="25" />`,
  }),
};

/** No page size selector. */
export const NoPageSizeSelector: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="100" [pageSize]="10" [pageSizeOptions]="[]" />`,
  }),
};

/**
 * Disabled pagination — all controls are greyed out and non-interactive.
 * Useful for loading states or when data is not yet available.
 */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="100" [pageSize]="10" [disabled]="true" />`,
  }),
};
