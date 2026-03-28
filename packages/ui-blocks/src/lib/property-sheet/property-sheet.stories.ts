import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIPropertySheet } from "./property-sheet.component";
import type {
  PropertyChangeEvent,
  PropertyFieldDefinition,
} from "./property-sheet.types";

// ── Sample data ──────────────────────────────────────────────────────

interface WidgetConfig {
  name: string;
  description: string;
  width: number;
  height: number;
  visible: boolean;
  theme: string;
  accentColor: string;
  opacity: number;
}

const FIELDS: PropertyFieldDefinition<WidgetConfig>[] = [
  {
    key: "name",
    label: "Name",
    type: "string",
    group: "General",
    placeholder: "Widget name",
  },
  {
    key: "description",
    label: "Description",
    type: "string",
    group: "General",
    placeholder: "Optional description",
  },
  { key: "width", label: "Width", type: "number", group: "Dimensions" },
  { key: "height", label: "Height", type: "number", group: "Dimensions" },
  { key: "visible", label: "Visible", type: "boolean", group: "Display" },
  {
    key: "theme",
    label: "Theme",
    type: "select",
    group: "Display",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "auto", label: "System" },
    ],
  },
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    group: "Display",
  },
  {
    key: "opacity",
    label: "Opacity",
    type: "slider",
    group: "Display",
    min: 0,
    max: 100,
    step: 5,
  },
];

const INITIAL: WidgetConfig = {
  name: "My Widget",
  description: "",
  width: 320,
  height: 240,
  visible: true,
  theme: "auto",
  accentColor: "#0061a4",
  opacity: 100,
};

// ── Demo components ──────────────────────────────────────────────────

const outputStyles = `
  :host { display: block; }
  .story-output {
    margin-top: 1rem; font-size: 0.78rem; padding: 0.75rem;
    background: var(--ui-surface-2, #fbfbfc);
    color: var(--ui-text, #1d232b);
    border: 1px solid var(--ui-border, #d7dce2);
    border-radius: 4px;
    font-family: var(--ui-font, monospace);
  }
`;

@Component({
  selector: "ui-property-sheet-default-demo",
  standalone: true,
  imports: [UIPropertySheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <ui-property-sheet
      [fields]="fields"
      [(data)]="data"
      (propertyChange)="onChanged($event)"
      ariaLabel="Widget settings"
    />
    @if (lastEvent()) {
      <div class="story-output">
        <strong>Last change:</strong> {{ lastEvent()!.key }} =
        {{ lastEvent()!.value }}
      </div>
    }
  `,
})
class DefaultDemo {
  protected readonly fields = FIELDS;
  protected readonly data = signal({ ...INITIAL });
  protected readonly lastEvent = signal<
    PropertyChangeEvent<WidgetConfig> | undefined
  >(undefined);

  protected onChanged(event: PropertyChangeEvent<WidgetConfig>): void {
    this.lastEvent.set(event);
  }
}

@Component({
  selector: "ui-property-sheet-readonly-demo",
  standalone: true,
  imports: [UIPropertySheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-property-sheet
      [fields]="fields"
      [(data)]="data"
      ariaLabel="Read-only settings"
    />
  `,
})
class ReadonlyDemo {
  protected readonly fields: PropertyFieldDefinition<WidgetConfig>[] =
    FIELDS.map((f) => ({ ...f, readonly: true }));
  protected readonly data = signal({ ...INITIAL });
}

@Component({
  selector: "ui-property-sheet-flat-demo",
  standalone: true,
  imports: [UIPropertySheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-property-sheet
      [fields]="fields"
      [(data)]="data"
      ariaLabel="Flat settings"
    />
  `,
})
class FlatDemo {
  protected readonly fields: PropertyFieldDefinition<WidgetConfig>[] =
    FIELDS.map(({ group: _, ...rest }) => rest);
  protected readonly data = signal({ ...INITIAL });
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/UI Blocks/Property Sheet",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIPropertySheet` is a key-value inspector panel that renders a schema of typed fields against a data object.",
          "",
          "Each field definition maps to an appropriate editor widget: `UIInput`, `UISelect`, `UICheckbox`, `UIColorPicker`, or `UISlider`.",
          "",
          "## Features",
          "",
          "- **Grouped fields** — fields with the same `group` are rendered under a shared heading.",
          "- **Typed editors** — `string`, `number`, `boolean`, `select`, `color`, `slider`.",
          "- **Two-way binding** — `[(data)]` keeps the source object in sync.",
          "- **Change events** — `propertyChange` emits key, value, and the full updated object.",
          "- **Read-only** — set `readonly: true` on individual fields.",
          "",
          "## CSS Custom Properties",
          "",
          "`--ui-surface`, `--ui-text`, `--ui-border`, `--ui-group-bg`, `--ui-text-muted`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the property sheet.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DefaultDemo, ReadonlyDemo, FlatDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Default** — Grouped property sheet with all field types
 * and live change output.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-property-sheet-default-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-property-sheet
  [fields]="fields"
  [(data)]="config"
  (propertyChange)="onChanged($event)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIPropertySheet, type PropertyFieldDefinition } from '@theredhead/ui-blocks';

interface Config {
  name: string;
  theme: string;
  accentColor: string;
  opacity: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UIPropertySheet],
  template: \\\`
    <ui-property-sheet [fields]="fields" [(data)]="config" />
  \\\`,
})
export class SettingsComponent {
  readonly fields: PropertyFieldDefinition<Config>[] = [
    { key: 'name', label: 'Name', type: 'string', group: 'General' },
    { key: 'theme', label: 'Theme', type: 'select', group: 'Appearance',
      options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] },
    { key: 'accentColor', label: 'Accent', type: 'color', group: 'Appearance' },
    { key: 'opacity', label: 'Opacity', type: 'slider', group: 'Appearance', min: 0, max: 100 },
  ];
  readonly config = signal<Config>({ name: 'My App', theme: 'light', accentColor: '#0061a4', opacity: 100 });
}

// ── SCSS ──
/* No custom styles needed — tokens handle theming. */
`,
      },
    },
  },
};

/**
 * **Read-only** — All fields locked to read-only.
 */
export const Readonly: Story = {
  render: () => ({
    template: `<ui-property-sheet-readonly-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-property-sheet [fields]="readonlyFields" [(data)]="config" />

// All fields have readonly: true
`,
      },
    },
  },
};

/**
 * **Flat (no groups)** — Fields without group headings.
 */
export const Flat: Story = {
  render: () => ({
    template: `<ui-property-sheet-flat-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// Fields without the 'group' property render without headings.
const fields: PropertyFieldDefinition<Config>[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'enabled', label: 'Enabled', type: 'boolean' },
];
`,
      },
    },
  },
};
