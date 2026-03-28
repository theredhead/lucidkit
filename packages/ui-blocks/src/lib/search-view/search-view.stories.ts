import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FilterableArrayDatasource, UITextColumn } from "@theredhead/ui-kit";

import { UISearchView } from "./search-view.component";
import type { SavedSearch } from "./saved-search.types";

// ── Sample data ──────────────────────────────────────────────────────

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

const PRODUCTS: Product[] = [
  {
    name: "Mechanical Keyboard",
    category: "Peripherals",
    price: 149.99,
    stock: 42,
    sku: "KB-001",
  },
  {
    name: "Wireless Mouse",
    category: "Peripherals",
    price: 59.99,
    stock: 128,
    sku: "MS-002",
  },
  {
    name: '27" 4K Monitor',
    category: "Displays",
    price: 449.99,
    stock: 15,
    sku: "MN-003",
  },
  {
    name: "USB-C Hub",
    category: "Accessories",
    price: 39.99,
    stock: 200,
    sku: "HB-004",
  },
  {
    name: "Webcam HD",
    category: "Peripherals",
    price: 89.99,
    stock: 67,
    sku: "WC-005",
  },
  {
    name: "Standing Desk",
    category: "Furniture",
    price: 599.99,
    stock: 8,
    sku: "DK-006",
  },
  {
    name: "Monitor Arm",
    category: "Accessories",
    price: 79.99,
    stock: 34,
    sku: "MA-007",
  },
  {
    name: "Desk Lamp",
    category: "Accessories",
    price: 44.99,
    stock: 91,
    sku: "DL-008",
  },
  {
    name: "Noise-Cancelling Headphones",
    category: "Audio",
    price: 299.99,
    stock: 23,
    sku: "HP-009",
  },
  {
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 69.99,
    stock: 56,
    sku: "SP-010",
  },
  {
    name: "Laptop Stand",
    category: "Accessories",
    price: 34.99,
    stock: 144,
    sku: "LS-011",
  },
  {
    name: "Cable Management Kit",
    category: "Accessories",
    price: 19.99,
    stock: 310,
    sku: "CM-012",
  },
  {
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 799.99,
    stock: 5,
    sku: "CH-013",
  },
  {
    name: "Docking Station",
    category: "Peripherals",
    price: 189.99,
    stock: 28,
    sku: "DS-014",
  },
  {
    name: "Portable SSD 1TB",
    category: "Storage",
    price: 109.99,
    stock: 75,
    sku: "SS-015",
  },
];

// ── Demo components ──────────────────────────────────────────────────

@Component({
  selector: "ui-search-view-default-demo",
  standalone: true,
  imports: [UISearchView, UITextColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 500px; display: flex; flex-direction: column;">
      <ui-search-view [datasource]="ds" title="Products" [pageSize]="10">
        <ui-text-column key="name" headerText="Name" />
        <ui-text-column key="category" headerText="Category" />
        <ui-text-column key="sku" headerText="SKU" />
      </ui-search-view>
    </div>
  `,
})
class DefaultDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);
}

@Component({
  selector: "ui-search-view-filter-demo",
  standalone: true,
  imports: [UISearchView, UITextColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 600px; display: flex; flex-direction: column;">
      <ui-search-view
        [datasource]="ds"
        title="Products"
        [showFilter]="true"
        [pageSize]="10"
      >
        <ui-text-column key="name" headerText="Name" />
        <ui-text-column key="category" headerText="Category" />
        <ui-text-column key="price" headerText="Price" />
        <ui-text-column key="stock" headerText="Stock" />
        <ui-text-column key="sku" headerText="SKU" />
      </ui-search-view>
    </div>
  `,
})
class FilterDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);
}

@Component({
  selector: "ui-search-view-custom-layout-demo",
  standalone: true,
  imports: [UISearchView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
      }
      .product-card {
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--ui-border, #d7dce2);
        background: var(--ui-surface, #ffffff);
        color: var(--ui-text, #1d232b);
      }
      .product-card h4 {
        margin: 0 0 0.25rem;
        font-size: 0.88rem;
      }
      .product-card p {
        margin: 0;
        font-size: 0.78rem;
        opacity: 0.7;
      }
      .product-card .price {
        font-weight: 600;
        margin-top: 0.5rem;
      }
    `,
  ],
  template: `
    <div style="height: 500px; display: flex; flex-direction: column;">
      <ui-search-view
        [datasource]="ds"
        layout="custom"
        title="Product Catalog"
        [showFilter]="true"
        [showPagination]="false"
      >
        <ng-template #results let-items>
          <div class="product-grid">
            @for (item of items; track item.sku) {
              <div class="product-card">
                <h4>{{ item.name }}</h4>
                <p>{{ item.category }}</p>
                <p class="price">\${{ item.price }}</p>
              </div>
            }
          </div>
        </ng-template>
      </ui-search-view>
    </div>
  `,
})
class CustomLayoutDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);
}

@Component({
  selector: "ui-search-view-no-filter-demo",
  standalone: true,
  imports: [UISearchView, UITextColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 400px; display: flex; flex-direction: column;">
      <ui-search-view
        [datasource]="ds"
        title="Inventory"
        [showFilter]="false"
        [pageSize]="5"
      >
        <ui-text-column key="name" headerText="Name" />
        <ui-text-column key="stock" headerText="Stock" />
        <ui-text-column key="sku" headerText="SKU" />
      </ui-search-view>
    </div>
  `,
})
class NoFilterDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);
}

@Component({
  selector: "ui-search-view-saved-searches-demo",
  standalone: true,
  imports: [UISearchView, UITextColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 600px; display: flex; flex-direction: column;">
      <ui-search-view
        [datasource]="ds"
        title="Products"
        [showFilter]="true"
        storageKey="storybook-search-demo"
        [pageSize]="10"
        (savedSearchChange)="onSavedSearchChange($event)"
      >
        <ui-text-column key="name" headerText="Name" />
        <ui-text-column key="category" headerText="Category" />
        <ui-text-column key="price" headerText="Price" />
        <ui-text-column key="stock" headerText="Stock" />
        <ui-text-column key="sku" headerText="SKU" />
      </ui-search-view>
    </div>
  `,
})
class SavedSearchesDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);

  protected onSavedSearchChange(search: SavedSearch | null): void {
    console.log("Saved search changed:", search);
  }
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Blocks/Search View",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UISearchView` is a unified browse-and-filter layout that composes `UIFilter`, `UITableView` (or a custom results template), and `UIPagination` into a single search screen.",
          "",
          "## Layout Modes",
          "",
          "- **Table** (default) — project `<ui-text-column>` / `<ui-template-column>` children to define the table.",
          "- **Custom** — project an `#results` template to render items however you like (card grid, list, etc.).",
          "",
          "## Filter",
          "",
          "The filter section auto-detects when the datasource is a `FilterableArrayDatasource` and infers field definitions from columns and data types. Override with `[filterFields]` or project a `#filter` template for full control.",
          "",
          "## CSS Custom Properties",
          "",
          "`--ui-surface`, `--ui-text`, `--ui-border`, `--ui-bg`, `--ui-filter-bg`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed in the header area.",
    },
    layout: {
      control: "select",
      options: ["table", "custom"],
      description: "Layout mode for results.",
    },
    showFilter: {
      control: "boolean",
      description: "Show the filter section.",
    },
    filterExpanded: {
      control: "boolean",
      description: "Whether the filter starts expanded.",
    },
    filterModeLocked: {
      control: "boolean",
      description: "Hide the filter toggle button.",
    },
    showPagination: {
      control: "boolean",
      description: "Show the pagination footer.",
    },
    pageSize: {
      control: "number",
      description: "Items per page.",
    },
    placeholder: {
      control: "text",
      description: "Empty-state text.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the search view.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DefaultDemo,
        FilterDemo,
        CustomLayoutDemo,
        NoFilterDemo,
        SavedSearchesDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Default** — Table layout with auto-detected filter from a
 * `FilterableArrayDatasource`. Filter bar, table columns, and
 * pagination are all rendered automatically.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-search-view-default-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-search-view [datasource]="ds" title="Products" [pageSize]="10">
  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="category" headerText="Category" />
  <ui-text-column key="sku" headerText="SKU" />
</ui-search-view>

// ── TypeScript ──
import { Component } from '@angular/core';
import { FilterableArrayDatasource } from '@theredhead/foundation';
import { UISearchView, UITextColumn } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: \\\`
    <ui-search-view [datasource]="ds" title="Products" [pageSize]="10">
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
      <ui-text-column key="sku" headerText="SKU" />
    </ui-search-view>
  \\\`,
})
export class ExampleComponent {
  readonly ds = new FilterableArrayDatasource(products);
}

// ── SCSS ──
/* No custom styles needed — tokens handle theming. */
`,
      },
    },
  },
};

/**
 * **With Filter** — Explicit filter enabled showing all columns
 * including price and stock. Auto-inferred filter field definitions.
 */
export const WithFilter: Story = {
  render: () => ({
    template: `<ui-search-view-filter-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-search-view [datasource]="ds" title="Products" [showFilter]="true" [pageSize]="10">
  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="category" headerText="Category" />
  <ui-text-column key="price" headerText="Price" />
  <ui-text-column key="stock" headerText="Stock" />
</ui-search-view>
`,
      },
    },
  },
};

/**
 * **Custom Layout** — Uses a projected `#results` template to render
 * items as a responsive card grid instead of a table.
 */
export const CustomLayout: Story = {
  render: () => ({
    template: `<ui-search-view-custom-layout-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-search-view [datasource]="ds" layout="custom" title="Catalog" [showFilter]="true">
  <ng-template #results let-items>
    <div class="product-grid">
      @for (item of items; track item.id) {
        <div class="product-card">
          <h4>{{ item.name }}</h4>
          <p>{{ item.category }}</p>
        </div>
      }
    </div>
  </ng-template>
</ui-search-view>

// ── SCSS ──
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 0.75rem;
}
`,
      },
    },
  },
};

/**
 * **No Filter** — Table-only view with the filter section hidden
 * and a smaller page size.
 */
export const NoFilter: Story = {
  render: () => ({
    template: `<ui-search-view-no-filter-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-search-view [datasource]="ds" title="Inventory" [showFilter]="false" [pageSize]="5">
  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="stock" headerText="Stock" />
</ui-search-view>
`,
      },
    },
  },
};

/**
 * **With Saved Searches** — Demonstrates the saved-search chip strip.
 * Set `storageKey` to enable. Users can save named filter states and
 * switch between them by clicking chips. Chips can be reordered by
 * dragging and deleted with the × button. Data is persisted via the
 * `StorageService` (defaults to `localStorage`).
 */
export const WithSavedSearches: Story = {
  render: () => ({
    template: `<ui-search-view-saved-searches-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-search-view
  [datasource]="ds"
  title="Products"
  [showFilter]="true"
  storageKey="my-products"
  [pageSize]="10"
  (savedSearchChange)="onSavedSearchChange($event)"
>
  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="category" headerText="Category" />
  <ui-text-column key="price" headerText="Price" />
  <ui-text-column key="stock" headerText="Stock" />
</ui-search-view>

// ── TypeScript ──
import { Component } from '@angular/core';
import { FilterableArrayDatasource } from '@theredhead/foundation';
import { UISearchView, UITextColumn, type SavedSearch } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: \\\`
    <ui-search-view
      [datasource]="ds"
      title="Products"
      [showFilter]="true"
      storageKey="my-products"
      (savedSearchChange)="onSavedSearchChange($event)"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
    </ui-search-view>
  \\\`,
})
export class ExampleComponent {
  readonly ds = new FilterableArrayDatasource(products);

  onSavedSearchChange(search: SavedSearch | null): void {
    console.log('Saved search:', search);
  }
}

// ── SCSS ──
/* No custom styles needed. Override \`StorageService\` strategy for
   server-side persistence:
   providers: [{ provide: STORAGE_STRATEGY, useClass: MyApiStrategy }]
*/
`,
      },
    },
  },
};
