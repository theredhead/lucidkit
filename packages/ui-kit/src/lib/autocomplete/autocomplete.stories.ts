import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import {
  UIAutocomplete,
  type AutocompleteDatasource,
} from "./autocomplete.component";

// ── Helpers ────────────────────────────────────────────────────────

/** A trivial string datasource that does case-insensitive prefix matching. */
class FruitDatasource implements AutocompleteDatasource<string> {
  private readonly fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Coconut",
    "Cranberry",
    "Dragonfruit",
    "Fig",
    "Grape",
    "Guava",
    "Kiwi",
    "Lemon",
    "Lime",
    "Lychee",
    "Mango",
    "Melon",
    "Nectarine",
    "Orange",
    "Papaya",
    "Peach",
    "Pear",
    "Pineapple",
    "Plum",
    "Pomegranate",
    "Raspberry",
    "Strawberry",
    "Watermelon",
  ];

  completeFor(query: string, selection: readonly string[]): string[] {
    const lq = query.toLowerCase();
    return this.fruits.filter(
      (f) => f.toLowerCase().includes(lq) && !selection.includes(f),
    );
  }
}

/** A rich-object datasource for the custom-template story. */
interface Contact {
  name: string;
  email: string;
  department: string;
}

const CONTACTS: Contact[] = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
  },
  { name: "Bob Smith", email: "bob@example.com", department: "Design" },
  { name: "Carol White", email: "carol@example.com", department: "Marketing" },
  { name: "Dave Brown", email: "dave@example.com", department: "Engineering" },
  { name: "Eve Davis", email: "eve@example.com", department: "Product" },
  {
    name: "Frank Miller",
    email: "frank@example.com",
    department: "Engineering",
  },
  { name: "Grace Lee", email: "grace@example.com", department: "Design" },
  { name: "Hank Wilson", email: "hank@example.com", department: "Marketing" },
];

class ContactDatasource implements AutocompleteDatasource<Contact> {
  completeFor(query: string, selection: readonly Contact[]): Contact[] {
    const lq = query.toLowerCase();
    const selectedEmails = new Set(selection.map((c) => c.email));
    return CONTACTS.filter(
      (c) =>
        !selectedEmails.has(c.email) &&
        (c.name.toLowerCase().includes(lq) ||
          c.email.toLowerCase().includes(lq) ||
          c.department.toLowerCase().includes(lq)),
    );
  }
}

// ── Demo wrapper components ────────────────────────────────────────

/**
 * Basic single-select demo with plain strings.
 */
@Component({
  selector: "ui-ac-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete, JsonPipe],
  template: `
    <ui-autocomplete
      [datasource]="ds"
      [(value)]="selected"
      placeholder="Search fruits…"
      ariaLabel="Fruit search"
    />
    <pre class="story-output">Selected: {{ selected() | json }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class BasicDemo {
  readonly ds = new FruitDatasource();
  readonly selected = signal<readonly string[]>([]);
}

/**
 * Multi-select demo with chips.
 */
@Component({
  selector: "ui-ac-multi-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete, JsonPipe],
  template: `
    <ui-autocomplete
      [datasource]="ds"
      [(value)]="selected"
      [multiple]="true"
      placeholder="Pick fruits…"
      ariaLabel="Multi-fruit search"
    />
    <pre class="story-output">Selected: {{ selected() | json }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class MultiDemo {
  readonly ds = new FruitDatasource();
  readonly selected = signal<readonly string[]>([]);
}

/**
 * Custom template demo with rich Contact objects.
 */
@Component({
  selector: "ui-ac-template-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete, JsonPipe],
  template: `
    <ui-autocomplete
      [datasource]="ds"
      [(value)]="selected"
      [multiple]="true"
      [displayWith]="displayContact"
      [trackBy]="trackByEmail"
      placeholder="Search contacts…"
      ariaLabel="Contact search"
    >
      <ng-template let-item>
        <div class="contact-item">
          <strong>{{ item.name }}</strong>
          <small>{{ item.email }} · {{ item.department }}</small>
        </div>
      </ng-template>
    </ui-autocomplete>
    <pre class="story-output">Selected: {{ selected() | json }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
      .contact-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 2px 0;
      }
      .contact-item strong {
        font-weight: 600;
      }
      .contact-item small {
        font-size: 0.75rem;
        opacity: 0.7;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class TemplateDemo {
  readonly ds = new ContactDatasource();
  readonly selected = signal<readonly Contact[]>([]);
  readonly displayContact = (c: Contact) => c.name;
  readonly trackByEmail = (c: Contact) => c.email;
}

/**
 * Disabled state demo.
 */
@Component({
  selector: "ui-ac-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete],
  template: `
    <ui-autocomplete
      [datasource]="ds"
      [disabled]="true"
      placeholder="Disabled autocomplete"
      ariaLabel="Disabled"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
    `,
  ],
})
class DisabledDemo {
  readonly ds = new FruitDatasource();
}

// ── Story meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAutocomplete` is a type-ahead search input that queries a pluggable datasource as the user types and presents matching suggestions in a dropdown panel.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UIAutocomplete,
        BasicDemo,
        MultiDemo,
        TemplateDemo,
        DisabledDemo,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

// ── Stories ─────────────────────────────────────────────────────────

/**
 * **Basic (single-select)** — The simplest usage: a plain-string datasource
 * with prefix matching. Type a letter to see matching fruits appear in the
 * dropdown. Selecting an item replaces the input text and adds it to the
 * `value` array.
 */
export const Basic: Story = {
  render: () => ({
    template: `<ui-ac-basic-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-autocomplete
  [datasource]="ds"
  [(value)]="selected"
  placeholder="Search fruits…"
  ariaLabel="Fruit search"
/>

<!-- Component class:
readonly ds = new FruitDatasource();
readonly selected = signal<readonly string[]>([]); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **Multi-select** — When `[multiple]="true"`, selected items are rendered as
 * removable chips above the input field. The datasource automatically
 * excludes already-selected items from future suggestions, preventing
 * duplicates. Click the × button on a chip or press Backspace to remove it.
 */
export const MultipleSelection: Story = {
  render: () => ({
    template: `<ui-ac-multi-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-autocomplete
  [datasource]="ds"
  [(value)]="selected"
  [multiple]="true"
  placeholder="Pick fruits…"
  ariaLabel="Multi-fruit search"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Custom template** — Project an `<ng-template let-item>` inside
 * `<ui-autocomplete>` to fully control how each suggestion row is rendered.
 * This example uses rich `Contact` objects with name, email and department.
 * The `displayWith` function controls what text appears in chips, while
 * `trackBy` provides stable identity via the email field.
 */
export const CustomTemplate: Story = {
  render: () => ({
    template: `<ui-ac-template-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-autocomplete
  [datasource]="ds"
  [(value)]="selected"
  [multiple]="true"
  [displayWith]="displayContact"
  [trackBy]="trackByEmail"
  placeholder="Search contacts…"
  ariaLabel="Contact search">
  <ng-template let-item>
    <div class="contact-item">
      <strong>{{ item.name }}</strong>
      <small>{{ item.email }} · {{ item.department }}</small>
    </div>
  </ng-template>
</ui-autocomplete>

<!-- Component class:
readonly displayContact = (c: Contact) => c.name;
readonly trackByEmail = (c: Contact) => c.email; -->`,
        language: "html",
      },
    },
  },
};

/**
 * **Disabled** — Setting `[disabled]="true"` prevents focus, typing, and
 * opening the suggestion panel. The input is visually dimmed to indicate
 * the non-interactive state.
 */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-ac-disabled-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-autocomplete
  [datasource]="ds"
  [disabled]="true"
  placeholder="Disabled autocomplete"
  ariaLabel="Disabled"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, outputs, and datasource interface.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — supply any object implementing `AutocompleteDatasource<T>` to control suggestions",
          "- **Single & multi-select** — toggle `[multiple]` to allow chip-based multi-selection",
          "- **Custom templates** — project an `<ng-template let-item>` to render rich suggestion rows",
          "- **Identity functions** — `displayWith` controls chip labels; `trackBy` provides stable identity for objects",
          "- **Accessible** — ARIA combobox + listbox roles, keyboard navigation, screen-reader announcements",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `AutocompleteDatasource<T>` | *(required)* | Provides suggestions for a given query string and current selection |",
          '| `placeholder` | `string` | `""` | Placeholder text shown when the input is empty |',
          "| `disabled` | `boolean` | `false` | Disables the input and hides the suggestion panel |",
          "| `multiple` | `boolean` | `false` | Enables multi-select mode with removable chips |",
          "| `minChars` | `number` | `1` | Minimum characters before the datasource is queried |",
          "| `displayWith` | `(item: T) => string` | `String()` | Formats an item for display in chips |",
          "| `trackBy` | `(item: T) => unknown` | identity | Returns a stable key for item comparison |",
          '| `ariaLabel` | `string` | `"Autocomplete"` | Accessible label forwarded to the native input |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `readonly T[]` | Two-way bound array of selected items |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `itemSelected` | `T` | Emitted when a suggestion is picked |",
          "| `itemRemoved` | `T` | Emitted when a chip is removed (multi-select) |",
          "",
          "## Datasource Interface",
          "",
          "```ts",
          "interface AutocompleteDatasource<T> {",
          "  completeFor(query: string, selection: readonly T[]): T[] | Observable<T[]>;",
          "}",
          "```",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
