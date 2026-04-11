import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcons, UIButton } from "@theredhead/lucid-kit";

import { UICommandPalette } from "./command-palette.component";
import type {
  CommandExecuteEvent,
  CommandPaletteItem,
} from "./command-palette.types";

// ── Sample data ──────────────────────────────────────────────────────

const COMMANDS: CommandPaletteItem[] = [
  {
    id: "save",
    label: "Save File",
    group: "File",
    shortcut: "Cmd+S",
    icon: UIIcons.Lucide.Files.Save,
  },
  {
    id: "open",
    label: "Open File",
    group: "File",
    shortcut: "Cmd+O",
    icon: UIIcons.Lucide.Files.File,
  },
  {
    id: "close",
    label: "Close Tab",
    group: "File",
    shortcut: "Cmd+W",
    icon: UIIcons.Lucide.Math.X,
  },
  {
    id: "new-file",
    label: "New File",
    group: "File",
    shortcut: "Cmd+N",
    icon: UIIcons.Lucide.Files.FilePlus,
  },
  {
    id: "find",
    label: "Find in Files",
    group: "Search",
    shortcut: "Cmd+Shift+F",
    icon: UIIcons.Lucide.Social.Search,
    keywords: ["grep", "search", "find"],
  },
  {
    id: "replace",
    label: "Find and Replace",
    group: "Search",
    shortcut: "Cmd+H",
    icon: UIIcons.Lucide.Text.Replace,
  },
  {
    id: "goto-line",
    label: "Go to Line",
    group: "Navigation",
    shortcut: "Ctrl+G",
    icon: UIIcons.Lucide.Arrows.MoveRight,
  },
  {
    id: "goto-symbol",
    label: "Go to Symbol",
    group: "Navigation",
    shortcut: "Cmd+Shift+O",
    icon: UIIcons.Lucide.Account.Tag,
  },
  {
    id: "settings",
    label: "Open Settings",
    group: "Preferences",
    icon: UIIcons.Lucide.Account.Settings,
  },
  {
    id: "theme",
    label: "Toggle Theme",
    group: "Preferences",
    icon: UIIcons.Lucide.Weather.Sun,
  },
  {
    id: "disabled-cmd",
    label: "Disabled Command",
    group: "Preferences",
    disabled: true,
  },
];

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
  .trigger-btn kbd {
    font-size: 11px; padding: 2px 6px; border-radius: 4px;
    background: var(--ui-surface-2, #e8eaed);
    color: var(--ui-text-muted, #5f6672);
    border: 1px solid var(--ui-border, #d0d4da);
  }
`;

@Component({
  selector: "ui-command-palette-default-demo",
  standalone: true,
  imports: [UICommandPalette, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <ui-button class="trigger-btn" variant="outlined" (click)="open.set(true)">
      Open Command Palette <kbd>Cmd+K</kbd>
    </ui-button>

    <ui-command-palette
      [commands]="commands"
      [(open)]="open"
      (execute)="onExecute($event)"
    />

    @if (lastExecuted()) {
      <div class="story-output">
        <strong>Executed:</strong> {{ lastExecuted()!.command.label }} at
        {{ lastExecuted()!.executedAt }}
      </div>
    }
  `,
})
class DefaultDemo {
  protected readonly commands = COMMANDS;
  protected readonly open = signal(false);
  protected readonly lastExecuted = signal<CommandExecuteEvent | undefined>(
    undefined,
  );

  protected onExecute(event: CommandExecuteEvent): void {
    this.lastExecuted.set(event);
  }
}

@Component({
  selector: "ui-command-palette-no-recent-demo",
  standalone: true,
  imports: [UICommandPalette, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <ui-button class="trigger-btn" variant="outlined" (click)="open.set(true)">
      Open (No Recent) <kbd>Cmd+K</kbd>
    </ui-button>

    <ui-command-palette
      [commands]="commands"
      [(open)]="open"
      [maxRecent]="0"
      placeholder="Search actions…"
      (execute)="onExecute($event)"
    />

    @if (lastExecuted()) {
      <div class="story-output">
        <strong>Executed:</strong> {{ lastExecuted()!.command.label }}
      </div>
    }
  `,
})
class NoRecentDemo {
  protected readonly commands = COMMANDS;
  protected readonly open = signal(false);
  protected readonly lastExecuted = signal<CommandExecuteEvent | undefined>(
    undefined,
  );

  protected onExecute(event: CommandExecuteEvent): void {
    this.lastExecuted.set(event);
  }
}

@Component({
  selector: "ui-command-palette-minimal-demo",
  standalone: true,
  imports: [UICommandPalette, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <ui-button class="trigger-btn" variant="outlined" (click)="open.set(true)">
      Open Minimal Palette
    </ui-button>

    <ui-command-palette
      [commands]="commands"
      [(open)]="open"
      [maxRecent]="0"
      [globalShortcut]="false"
      placeholder="Quick actions…"
      (execute)="onExecute($event)"
    />

    @if (lastExecuted()) {
      <div class="story-output">
        <strong>Executed:</strong> {{ lastExecuted()!.command.label }}
      </div>
    }
  `,
})
class MinimalDemo {
  protected readonly commands: CommandPaletteItem[] = [
    { id: "bold", label: "Bold", shortcut: "Cmd+B" },
    { id: "italic", label: "Italic", shortcut: "Cmd+I" },
    { id: "underline", label: "Underline", shortcut: "Cmd+U" },
    { id: "link", label: "Insert Link", shortcut: "Cmd+K" },
    { id: "image", label: "Insert Image" },
    { id: "code", label: "Code Block" },
  ];
  protected readonly open = signal(false);
  protected readonly lastExecuted = signal<CommandExecuteEvent | undefined>(
    undefined,
  );

  protected onExecute(event: CommandExecuteEvent): void {
    this.lastExecuted.set(event);
  }
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/UI Blocks/Command Palette",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UICommandPalette` is a keyboard-triggered searchable action list inspired by VS Code's command palette.",
          "",
          "## Features",
          "",
          "- **Keyboard shortcut** — Opens with `Cmd+K` / `Ctrl+K` (configurable via `globalShortcut`).",
          "- **Fuzzy search** — Filters commands by label, group name, and keywords.",
          "- **Grouped results** — Commands with the same `group` appear under shared headings.",
          "- **Recent commands** — The most recently executed commands appear at the top.",
          "- **Keyboard navigation** — `↑` / `↓` to highlight, `Enter` to execute, `Esc` to close.",
          "- **Shortcut hints** — Display keyboard shortcuts alongside each command.",
          "- **Icons** — Optional SVG icons via the `UIIcons` registry.",
          "- **Accessible** — Full ARIA combobox + listbox pattern.",
          "",
          "## CSS Custom Properties",
          "",
          "`--cp-bg`, `--cp-text`, `--cp-border`, `--cp-item-active`, `--cp-kbd-bg`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    globalShortcut: {
      control: "boolean",
      description: "Enable Cmd+K / Ctrl+K global shortcut.",
    },
    maxRecent: {
      control: "number",
      description: "Max recent commands to track (0 = disabled).",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the command palette.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DefaultDemo, NoRecentDemo, MinimalDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Default** — Full command palette with icons, groups, shortcuts,
 * and recent commands. Click the button or press `Cmd+K` to open.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-command-palette-default-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<button (click)="paletteOpen = true">Open Palette</button>

<ui-command-palette
  [commands]="commands"
  [(open)]="paletteOpen"
  (execute)="onExecute($event)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UICommandPalette,
  type CommandPaletteItem,
  type CommandExecuteEvent,
} from '@theredhead/lucid-blocks';
import { UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICommandPalette],
  template: \\\`
    <button (click)="paletteOpen.set(true)">Open</button>
    <ui-command-palette
      [commands]="commands"
      [(open)]="paletteOpen"
      (execute)="onExecute($event)"
    />
  \\\`,
})
export class ExampleComponent {
  readonly paletteOpen = signal(false);
  readonly commands: CommandPaletteItem[] = [
    { id: 'save', label: 'Save', group: 'File', shortcut: 'Cmd+S', icon: UIIcons.Lucide.Files.Save },
    { id: 'find', label: 'Find', group: 'Search', shortcut: 'Cmd+F', icon: UIIcons.Lucide.Social.Search },
  ];

  onExecute(event: CommandExecuteEvent): void {
    console.log('Executed:', event.command.label);
  }
}

// ── SCSS ──
/* No custom styles needed — tokens handle theming. */
`,
      },
    },
  },
};

/**
 * **No Recent Commands** — Recent tracking is disabled (`maxRecent="0"`).
 */
export const NoRecent: Story = {
  render: () => ({
    template: `<ui-command-palette-no-recent-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-command-palette
  [commands]="commands"
  [(open)]="paletteOpen"
  [maxRecent]="0"
  placeholder="Search actions…"
  (execute)="onExecute($event)"
/>
`,
      },
    },
  },
};

/**
 * **Minimal (no groups, no icons)** — Simple flat list without
 * grouping, icons, or the global keyboard shortcut.
 */
export const Minimal: Story = {
  render: () => ({
    template: `<ui-command-palette-minimal-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-command-palette
  [commands]="commands"
  [(open)]="paletteOpen"
  [maxRecent]="0"
  [globalShortcut]="false"
  placeholder="Quick actions…"
/>
`,
      },
    },
  },
};
