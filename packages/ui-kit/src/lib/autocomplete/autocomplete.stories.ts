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
  title: "@theredhead/UI Kit/Autocomplete",
  tags: ["autodocs"],
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

/** Basic single-select autocomplete with a fruit list. */
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
 * Multi-select mode — selected items appear as removable chips above the
 * input. Already-selected items are excluded from suggestions.
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
 * Custom item template with rich Contact objects.
 * Uses `displayWith` for chip labels and `trackBy` for identity.
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

/** Disabled state — the input cannot be focused or typed into. */
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
