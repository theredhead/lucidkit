import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";

import type { FilterExpression } from "../../core/types/filter";

import { UITableView } from "../table-view.component";
import { UIAutogenerateColumnsDirective } from "./autogenerate-columns.directive";
import { ArrayDatasource } from "../datasources/array-datasource";
import { FilterableArrayDatasource } from "../datasources/filterable-array-datasource";
import { UIFilter } from "../../filter/filter.component";
import { inferFilterFields } from "../../filter/infer-filter-fields";
import { type FilterFieldDefinition } from "../../filter/filter.types";

@Component({
  selector: "ui-demo-autogenerate",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class DemoAutogenerateComponent {
  public readonly datasource = signal(
    new ArrayDatasource([
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
        {
          id: 3,
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
        },
        {
          id: 4,
          firstName: "Alice",
          lastName: "Williams",
          email: "alice@example.com",
        },
        {
          id: 5,
          firstName: "Charlie",
          lastName: "Brown",
          email: "charlie@example.com",
        },
      ]),
  );
}

@Component({
  selector: "ui-demo-autogenerate-custom",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="config()"
    ></ui-table-view>
  `,
})
class DemoAutogenerateCustomComponent {
  public readonly datasource = signal(
    new ArrayDatasource([
        {
          userId: 1,
          userName: "john_doe",
          userEmail: "john@example.com",
          createdAt: "2024-01-15",
        },
        {
          userId: 2,
          userName: "jane_smith",
          userEmail: "jane@example.com",
          createdAt: "2024-02-20",
        },
        {
          userId: 3,
          userName: "bob_johnson",
          userEmail: "bob@example.com",
          createdAt: "2024-03-10",
        },
      ]),
  );

  public readonly config = signal({
    excludeKeys: ["userId"],
    headerMap: {
      userName: "Username",
      userEmail: "Email Address",
      createdAt: "Joined",
    },
  });
}

@Component({
  selector: "ui-demo-autogenerate-no-humanize",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="{ humanizeHeaders: false }"
    ></ui-table-view>
  `,
})
class DemoAutogenerateNoHumanizeComponent {
  public readonly datasource = signal(
    new ArrayDatasource([
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
      ]),
  );
}

// ── Large data generators ───────────────────────────────────────────

const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Legal",
  "Design",
  "Product",
  "Operations",
  "Support",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
];

const statuses = ["Active", "On Leave", "Probation", "Contractor", "Remote"];

function generateEmployees(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[(i * 7 + 3) % lastNames.length];
    return {
      employeeId: 1000 + i,
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@acme.com`,
      department: departments[i % departments.length],
      salary: 45000 + ((i * 1337) % 85000),
      startDate: `${2018 + (i % 8)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      status: statuses[i % statuses.length],
    };
  });
}

function generateProducts(count: number) {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Food",
    "Health",
    "Automotive",
    "Office",
  ];
  const adjectives = [
    "Premium",
    "Eco",
    "Ultra",
    "Classic",
    "Smart",
    "Pro",
    "Mini",
    "Deluxe",
    "Basic",
    "Advanced",
  ];
  const nouns = [
    "Widget",
    "Gadget",
    "Device",
    "Tool",
    "Kit",
    "Set",
    "Pack",
    "Unit",
    "Module",
    "System",
  ];

  return Array.from({ length: count }, (_, i) => ({
    sku: `SKU-${String(i + 1).padStart(5, "0")}`,
    productName: `${adjectives[i % adjectives.length]} ${nouns[(i * 3) % nouns.length]} ${i + 1}`,
    category: categories[i % categories.length],
    unitPrice: +(5 + ((i * 13.37) % 495)).toFixed(2),
    stockQuantity: (i * 17) % 500,
    reorderLevel: 10 + (i % 40),
    supplierCode: `SUP-${String(((i * 7) % 50) + 1).padStart(3, "0")}`,
    isDiscontinued: i % 13 === 0,
  }));
}

function generateServerLogs(count: number) {
  const levels = ["INFO", "WARN", "ERROR", "DEBUG", "TRACE"];
  const services = [
    "api-gateway",
    "auth-service",
    "user-service",
    "payment-service",
    "notification-service",
    "search-service",
    "cache-service",
    "scheduler",
  ];
  const messages = [
    "Request processed successfully",
    "Connection timeout after 30s",
    "Rate limit exceeded for client",
    "Cache miss — fetching from DB",
    "Health check passed",
    "Retrying failed operation",
    "Session expired for user",
    "Index rebuild completed",
    "Queue depth threshold exceeded",
    "Certificate renewal scheduled",
  ];

  return Array.from({ length: count }, (_, i) => ({
    timestamp: `2026-03-${String((i % 28) + 1).padStart(2, "0")}T${String(i % 24).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}Z`,
    level: levels[i % levels.length],
    service: services[i % services.length],
    message: messages[i % messages.length],
    responseTimeMs: 5 + ((i * 31) % 2000),
    statusCode: [200, 201, 204, 400, 401, 403, 404, 500, 502, 503][i % 10],
    requestId: `req-${crypto.randomUUID().slice(0, 8)}`,
  }));
}

// ── Large-data demo components ──────────────────────────────────────

@Component({
  selector: "ui-demo-autogenerate-employees",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class DemoAutogenerateEmployeesComponent {
  public readonly datasource = signal(
    new ArrayDatasource(generateEmployees(200)),
  );
}

@Component({
  selector: "ui-demo-autogenerate-products",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="config()"
    ></ui-table-view>
  `,
})
class DemoAutogenerateProductsComponent {
  public readonly datasource = signal(
    new ArrayDatasource(generateProducts(500)),
  );
  public readonly config = signal({
    excludeKeys: ["isDiscontinued"],
    headerMap: {
      sku: "SKU",
      unitPrice: "Price ($)",
      stockQuantity: "In Stock",
      reorderLevel: "Reorder At",
      supplierCode: "Supplier",
    },
  });
}

@Component({
  selector: "ui-demo-autogenerate-logs",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class DemoAutogenerateLogsComponent {
  public readonly datasource = signal(
    new ArrayDatasource(generateServerLogs(1000)),
  );
}

@Component({
  selector: "ui-demo-autogenerate-employees-city",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="config()"
    ></ui-table-view>
  `,
})
class DemoAutogenerateEmployeesCityComponent {
  public readonly datasource = signal(
    new ArrayDatasource(
        generateEmployees(150).map((e, i) => ({
          ...e,
          city: cities[i % cities.length],
          floor: (i % 12) + 1,
          extension: 2000 + i,
        })),
      ),
  );
  public readonly config = signal({
    excludeKeys: ["employeeId"],
    headerMap: {
      firstName: "First",
      lastName: "Last",
      startDate: "Hire Date",
    },
  });
}

// ── Filtered + autogenerate demo components ─────────────────────────

const employeesForFilter = generateEmployees(200);
const employeeFilterFields = inferFilterFields(employeesForFilter[0]);

@Component({
  selector: "ui-demo-autogenerate-filtered",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  template: `
    <ui-filter
      [fields]="fields"
      [allowJunction]="true"
      (expressionChange)="onExpressionChange($event)"
    />
    <div style="margin-top: 0.75rem">
      <ui-table-view
        [datasource]="datasource"
        uiAutogenerateColumns
      ></ui-table-view>
    </div>
  `,
})
class DemoAutogenerateFilteredComponent {
  public readonly fields = employeeFilterFields;
  public readonly datasource = new FilterableArrayDatasource(
    employeesForFilter,
  );
  private readonly table = viewChild.required(UITableView);

  public onExpressionChange(
    expression: FilterExpression<Record<string, unknown>>,
  ): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}

const productsForFilter = generateProducts(500);
const productFilterFields: FilterFieldDefinition[] = inferFilterFields(
  productsForFilter[0],
).filter((f) => f.key !== "isDiscontinued");

@Component({
  selector: "ui-demo-autogenerate-filtered-products",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  template: `
    <ui-filter
      [fields]="fields"
      [allowJunction]="true"
      (expressionChange)="onExpressionChange($event)"
    />
    <div style="margin-top: 0.75rem">
      <ui-table-view
        [datasource]="datasource"
        [uiAutogenerateColumns]="columnConfig()"
      ></ui-table-view>
    </div>
  `,
})
class DemoAutogenerateFilteredProductsComponent {
  public readonly fields = productFilterFields;
  public readonly columnConfig = signal({
    excludeKeys: ["isDiscontinued"],
    headerMap: {
      sku: "SKU",
      unitPrice: "Price ($)",
      stockQuantity: "In Stock",
      reorderLevel: "Reorder At",
      supplierCode: "Supplier",
    },
  });

  public readonly datasource = new FilterableArrayDatasource(
    productsForFilter,
  );
  private readonly table = viewChild.required(UITableView);

  public onExpressionChange(
    expression: FilterExpression<Record<string, unknown>>,
  ): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<UITableView> = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: UITableView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A structural directive that automatically generates table columns " +
          "by introspecting the first row of a `UITableView` datasource.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DemoAutogenerateComponent,
        DemoAutogenerateCustomComponent,
        DemoAutogenerateNoHumanizeComponent,
        DemoAutogenerateEmployeesComponent,
        DemoAutogenerateProductsComponent,
        DemoAutogenerateLogsComponent,
        DemoAutogenerateEmployeesCityComponent,
        DemoAutogenerateFilteredComponent,
        DemoAutogenerateFilteredProductsComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UITableView>;

/**
 * Automatically generate table columns from the first row's properties.
 *
 * No need to manually declare each column — the directive introspects
 * the datasource and creates text columns with humanized headers.
 */
export const Autogenerate: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate></ui-demo-autogenerate>",
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Key Features\n\n" +
          "- **Zero-config columns** \u2014 attach `uiAutogenerateColumns` and the directive creates a `UITextColumn` for every property in the first data row\n" +
          '- **Header humanization** \u2014 `camelCase` and `snake_case` keys are converted to title-cased labels (e.g. `firstName` \u2192 "First Name")\n' +
          "- **Custom header mapping** \u2014 override individual headers via `headerMap`\n" +
          "- **Exclude keys** \u2014 hide properties via `excludeKeys`\n" +
          "- **Reactive** \u2014 columns regenerate when the datasource or config signal changes\n" +
          "- **Works with `UIFilter`** \u2014 combine with `inferFilterFields()` for fully auto-generated table + filter UIs\n\n" +
          "### Configuration\n\n" +
          "| Property | Type | Default | Description |\n" +
          "|----------|------|---------|-------------|\n" +
          "| `humanizeHeaders` | `boolean` | `true` | Convert camelCase/snake_case keys to title-cased labels |\n" +
          "| `headerMap` | `Record<string, string>` | `{}` | Explicit header text overrides per key |\n" +
          "| `excludeKeys` | `string[]` | `[]` | Property keys to omit from the generated columns |\n\n" +
          "### Usage Modes\n\n" +
          "| Mode | Syntax |\n" +
          "|------|--------|\n" +
          "| No config (defaults) | `uiAutogenerateColumns` |\n" +
          '| With config object | `[uiAutogenerateColumns]="config"` |',
      },
      source: {
        language: "html",
        code: `
// \u2500\u2500 HTML \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<ui-table-view
  [datasource]="datasource()"
  uiAutogenerateColumns
/>

// \u2500\u2500 TypeScript \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
import { Component, signal } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = signal(
    new ArrayDatasource([
        { id: 1, firstName: 'Alice', email: 'alice@example.com' },
        { id: 2, firstName: 'Bob',   email: 'bob@example.com' },
      ]),
  );
}

// \u2500\u2500 SCSS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/* No custom styles needed \u2014 inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * Customize column generation with header mapping and excluded keys.
 *
 * Use `headerMap` to rename columns and `excludeKeys` to hide properties.
 */
export const AutogenerateCustom: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate-custom></ui-demo-autogenerate-custom>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// \u2500\u2500 HTML \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<ui-table-view
  [datasource]="datasource()"
  [uiAutogenerateColumns]="columnConfig()"
/>

// \u2500\u2500 TypeScript \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
import { Component, signal } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="columnConfig()"
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = signal(
    new ArrayDatasource(myData),
  );

  readonly columnConfig = signal({
    excludeKeys: ['userId'],
    headerMap: {
      userName: 'Username',
      userEmail: 'Email Address',
      createdAt: 'Joined',
    },
  });
}

// \u2500\u2500 SCSS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/* No custom styles needed \u2014 inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * Disable header humanization to use property names as-is.
 */
export const AutogenerateNoHumanize: Story = {
  render: (args) => ({
    props: args,
    template:
      "<ui-demo-autogenerate-no-humanize></ui-demo-autogenerate-no-humanize>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// \u2500\u2500 HTML \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<ui-table-view
  [datasource]="datasource()"
  [uiAutogenerateColumns]="{ humanizeHeaders: false }"
/>

// \u2500\u2500 TypeScript \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
import { Component } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="{ humanizeHeaders: false }"
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = new ArrayDatasource(myData);
}

// \u2500\u2500 SCSS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/* No custom styles needed \u2014 inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * **200 employees** — An employee directory with 8 columns auto-generated
 * from properties like `employeeId`, `firstName`, `lastName`, `email`,
 * `department`, `salary`, `startDate`, and `status`.
 *
 * Demonstrates virtual scrolling with a moderately-sized dataset.
 */
export const Employees200: Story = {
  render: (args) => ({
    props: args,
    template:
      "<ui-demo-autogenerate-employees></ui-demo-autogenerate-employees>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-table-view
  [datasource]="datasource()"
  uiAutogenerateColumns
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource"
      uiAutogenerateColumns
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = new ArrayDatasource([
    { employeeId: 1, firstName: 'Alice', lastName: 'Smith',
      email: 'alice@acme.com', department: 'Engineering',
      salary: 95000, startDate: '2021-03-15', status: 'Active' },
    // … more rows
  ]);
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * **500 products** — A product catalog with custom header mapping and
 * one excluded key (`isDiscontinued`). Shows how `headerMap` can provide
 * concise column titles like "Price ($)" and "In Stock".
 */
export const Products500: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate-products></ui-demo-autogenerate-products>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-table-view
  [datasource]="datasource()"
  [uiAutogenerateColumns]="columnConfig()"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="columnConfig()"
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = new ArrayDatasource(products);

  readonly columnConfig = signal({
    excludeKeys: ['isDiscontinued'],
    headerMap: {
      sku: 'SKU',
      unitPrice: 'Price ($)',
      stockQuantity: 'In Stock',
      reorderLevel: 'Reorder At',
      supplierCode: 'Supplier',
    },
  });
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * **1 000 server logs** — A high-volume log viewer with 7 auto-generated
 * columns including `timestamp`, `level`, `service`, `message`,
 * `responseTimeMs`, `statusCode`, and `requestId`.
 *
 * Useful for verifying virtual scroll performance at scale.
 */
export const ServerLogs1000: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate-logs></ui-demo-autogenerate-logs>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-table-view
  [datasource]="datasource()"
  uiAutogenerateColumns
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource"
      uiAutogenerateColumns
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = new ArrayDatasource([
    { timestamp: '2026-03-01T08:14:26Z', level: 'INFO',
      service: 'api-gateway', message: 'Request processed',
      responseTimeMs: 42, statusCode: 200,
      requestId: 'req-a1b2c3d4' },
    // … more rows
  ]);
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * **150 employees with extra columns** — Extended employee data with
 * `city`, `floor`, and `extension` fields. Uses `excludeKeys` to hide
 * the numeric ID and `headerMap` for compact column labels.
 *
 * This story has 10 columns to verify wider tables with autogeneration.
 */
export const EmployeesExtended150: Story = {
  render: (args) => ({
    props: args,
    template:
      "<ui-demo-autogenerate-employees-city></ui-demo-autogenerate-employees-city>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-table-view
  [datasource]="datasource()"
  [uiAutogenerateColumns]="columnConfig()"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import {
  UITableView,
  UIAutogenerateColumnsDirective,
  ArrayDatasource,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: \`
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="columnConfig()"
    />
  \`,
})
export class ExampleComponent {
  readonly datasource = new ArrayDatasource([
    { employeeId: 1, firstName: 'Alice', lastName: 'Smith',
      email: 'alice@acme.com', department: 'Engineering',
      salary: 95000, startDate: '2021-03-15', status: 'Active',
      city: 'New York', floor: 3, extension: 2001 },
    // … more rows
  ]);

  readonly columnConfig = signal({
    excludeKeys: ['employeeId'],
    headerMap: {
      firstName: 'First',
      lastName: 'Last',
      startDate: 'Hire Date',
    },
  });
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — inherits table-view tokens. */
`,
      },
    },
  },
};

/**
 * **200 employees + filter** — Combines `uiAutogenerateColumns` with
 * `<ui-filter>`. Filter fields are auto-inferred from the first data row
 * via `inferFilterFields()`, so neither the columns nor the filter fields
 * need to be declared manually.
 *
 * Try filtering by `department`, `salary`, or `startDate`.
 */
export const FilteredEmployees200: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate-filtered></ui-demo-autogenerate-filtered>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// \u2500\u2500 HTML \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<ui-filter
  [fields]="filterFields"
  [allowJunction]="true"
  (expressionChange)="onExpressionChange($event)"
/>

<ui-table-view
  [datasource]="datasource"
  uiAutogenerateColumns
/>

// \u2500\u2500 TypeScript \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
import { Component, viewChild } from '@angular/core';

import {
  UITableView,
  UIAutogenerateColumnsDirective,
  UIFilter,
  FilterableArrayDatasource,
  inferFilterFields,
  type FilterExpression,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  template: \`
    <ui-filter
      [fields]="filterFields"
      [allowJunction]="true"
      (expressionChange)="onExpressionChange($event)"
    />
    <ui-table-view
      [datasource]="datasource"
      uiAutogenerateColumns
    />
  \`,
})
export class ExampleComponent {
  private readonly table = viewChild.required(UITableView);
  readonly datasource = new FilterableArrayDatasource(myData);
  readonly filterFields = inferFilterFields(myData[0]);

  onExpressionChange(expression: FilterExpression<Record<string, unknown>>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}

// \u2500\u2500 SCSS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **500 products + filter** — A filterable product catalog with
 * auto-generated columns and custom header mapping. The `isDiscontinued`
 * field is excluded from both the columns and the filter fields.
 *
 * Demonstrates how `inferFilterFields` and `uiAutogenerateColumns`
 * work together for zero-config table + filter setups.
 */
export const FilteredProducts500: Story = {
  render: (args) => ({
    props: args,
    template:
      "<ui-demo-autogenerate-filtered-products></ui-demo-autogenerate-filtered-products>",
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-filter
  [fields]="filterFields"
  [allowJunction]="true"
  (expressionChange)="onExpressionChange($event)"
/>

<ui-table-view
  [datasource]="datasource"
  [uiAutogenerateColumns]="columnConfig()"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal, viewChild } from '@angular/core';

import {
  UITableView,
  UIAutogenerateColumnsDirective,
  UIFilter,
  FilterableArrayDatasource,
  inferFilterFields,
  type FilterExpression,
  type FilterFieldDefinition,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  template: \`
    <ui-filter
      [fields]="filterFields"
      [allowJunction]="true"
      (expressionChange)="onExpressionChange($event)"
    />
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="columnConfig()"
    />
  \`,
})
export class ExampleComponent {
  private readonly table = viewChild.required(UITableView);
  readonly datasource = new FilterableArrayDatasource(products);

  readonly filterFields: FilterFieldDefinition[] =
    inferFilterFields(products[0]).filter(f => f.key !== 'isDiscontinued');

  readonly columnConfig = signal({
    excludeKeys: ['isDiscontinued'],
    headerMap: {
      sku: 'SKU',
      unitPrice: 'Price ($)',
      stockQuantity: 'In Stock',
    },
  });

  onExpressionChange(expression: FilterExpression<Record<string, unknown>>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};
