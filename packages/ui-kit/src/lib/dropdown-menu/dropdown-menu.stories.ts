import { ChangeDetectionStrategy, Component } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import {
  UIDropdownDivider,
  UIDropdownItem,
  UIDropdownMenu,
} from "./dropdown-menu.component";
import { UIButton } from "../button/button.component";

@Component({
  selector: "ui-demo-dropdown-basic",
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-dropdown-menu>
      <ui-button trigger>Actions ▾</ui-button>
      <ui-dropdown-item>Edit</ui-dropdown-item>
      <ui-dropdown-item>Duplicate</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item>Archive</ui-dropdown-item>
      <ui-dropdown-item [disabled]="true">Delete</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
class DemoDropdownBasicComponent {}

@Component({
  selector: "ui-demo-dropdown-aligned",
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 2rem;">
      <ui-dropdown-menu align="start">
        <ui-button trigger>Start aligned ▾</ui-button>
        <ui-dropdown-item>Option A</ui-dropdown-item>
        <ui-dropdown-item>Option B</ui-dropdown-item>
      </ui-dropdown-menu>
      <ui-dropdown-menu align="end">
        <ui-button trigger>End aligned ▾</ui-button>
        <ui-dropdown-item>Option A</ui-dropdown-item>
        <ui-dropdown-item>Option B</ui-dropdown-item>
      </ui-dropdown-menu>
    </div>
  `,
})
class DemoDropdownAlignedComponent {}

@Component({
  selector: "ui-demo-dropdown-icons",
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-dropdown-menu>
      <ui-button trigger>File ▾</ui-button>
      <ui-dropdown-item>📄 New</ui-dropdown-item>
      <ui-dropdown-item>📂 Open</ui-dropdown-item>
      <ui-dropdown-item>💾 Save</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item>🖨️ Print</ui-dropdown-item>
      <ui-dropdown-item>📤 Export</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
class DemoDropdownIconsComponent {}

const meta: Meta<UIDropdownMenu> = {
  title: "@Theredhead/UI Kit/Dropdown Menu",
  component: UIDropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Horizontal alignment of the menu relative to the trigger.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the menu.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DemoDropdownBasicComponent,
        DemoDropdownAlignedComponent,
        DemoDropdownIconsComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A dropdown action menu triggered by a button or custom element.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<UIDropdownMenu>;

export const Basic: Story = {
  render: () => ({
    template: `<ui-demo-dropdown-basic />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Usage\n" +
          "```html\n" +
          "<ui-dropdown-menu>\n" +
          "  <ui-button trigger>Actions ▾</ui-button>\n" +
          '  <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>\n' +
          "  <ui-dropdown-divider />\n" +
          '  <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>\n' +
          "</ui-dropdown-menu>\n" +
          "```\n\n" +
          "### Features\n" +
          "- Click trigger to open, click item or Escape to close\n" +
          "- `start` / `end` horizontal alignment\n" +
          "- `<ui-dropdown-divider />` separators\n" +
          "- Disabled items via `[disabled]`\n" +
          "- Keyboard navigation (Enter, Space, Escape)\n" +
          "- Full dark-mode support",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-dropdown-menu>
  <ui-button trigger>Actions ▾</ui-button>
  <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
  <ui-dropdown-item (action)="onDuplicate()">Duplicate</ui-dropdown-item>
  <ui-dropdown-divider />
  <ui-dropdown-item (action)="onArchive()">Archive</ui-dropdown-item>
  <ui-dropdown-item [disabled]="true">Delete</ui-dropdown-item>
</ui-dropdown-menu>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIDropdownMenu, UIDropdownItem, UIDropdownDivider,
} from '@theredhead/ui-kit';
import { UIButton } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider, UIButton],
  template: \`
    <ui-dropdown-menu>
      <ui-button trigger>Actions ▾</ui-button>
      <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>
    </ui-dropdown-menu>
  \`,
})
export class ExampleComponent {
  onEdit()   { console.log('edit'); }
  onDelete() { console.log('delete'); }
}

// ── SCSS ──
/* No custom styles needed — dropdown tokens handle theming. */
`,
      },
    },
  },
};

export const Alignment: Story = {
  render: () => ({
    template: `<ui-demo-dropdown-aligned />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Panel aligns to the start (left) edge of the trigger -->
<ui-dropdown-menu align="start">
  <ui-button trigger>Start ▾</ui-button>
  <ui-dropdown-item>Option A</ui-dropdown-item>
  <ui-dropdown-item>Option B</ui-dropdown-item>
</ui-dropdown-menu>

<!-- Panel aligns to the end (right) edge of the trigger -->
<ui-dropdown-menu align="end">
  <ui-button trigger>End ▾</ui-button>
  <ui-dropdown-item>Option A</ui-dropdown-item>
  <ui-dropdown-item>Option B</ui-dropdown-item>
</ui-dropdown-menu>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIDropdownMenu, UIDropdownItem } from '@theredhead/ui-kit';
import { UIButton } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIButton],
  template: \`
    <ui-dropdown-menu align="end">
      <ui-button trigger>Menu ▾</ui-button>
      <ui-dropdown-item>Option A</ui-dropdown-item>
      <ui-dropdown-item>Option B</ui-dropdown-item>
    </ui-dropdown-menu>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — alignment is declarative. */
`,
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `<ui-demo-dropdown-icons />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-dropdown-menu>
  <ui-button trigger>File ▾</ui-button>
  <ui-dropdown-item>📄 New</ui-dropdown-item>
  <ui-dropdown-item>📂 Open</ui-dropdown-item>
  <ui-dropdown-item>💾 Save</ui-dropdown-item>
  <ui-dropdown-divider />
  <ui-dropdown-item>🖨️ Print</ui-dropdown-item>
  <ui-dropdown-item>📤 Export</ui-dropdown-item>
</ui-dropdown-menu>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIDropdownMenu, UIDropdownItem, UIDropdownDivider,
} from '@theredhead/ui-kit';
import { UIButton } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider, UIButton],
  template: \`
    <ui-dropdown-menu>
      <ui-button trigger>File ▾</ui-button>
      <ui-dropdown-item>📄 New</ui-dropdown-item>
      <ui-dropdown-item>💾 Save</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item>📤 Export</ui-dropdown-item>
    </ui-dropdown-menu>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — icons are inline content. */
`,
      },
    },
  },
};
