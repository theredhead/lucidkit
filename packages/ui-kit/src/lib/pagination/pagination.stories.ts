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
  decorators: [
    moduleMetadata({
      imports: [PaginationDemo],
    }),
  ],
  argTypes: {
    totalItems: { control: "number", description: "Total number of items" },
    pageSize: { control: "number", description: "Items per page" },
    disabled: { control: "boolean", description: "Disabled state" },
  },
};

export default meta;
type Story = StoryObj<UIPagination>;

/** Interactive demo with state. */
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

/** Small dataset. */
export const SmallDataset: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="30" [pageSize]="10" />`,
  }),
};

/** Large dataset. */
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

/** Disabled. */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-pagination [totalItems]="100" [pageSize]="10" [disabled]="true" />`,
  }),
};
