import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import type { SelectOption } from "../select/select.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import type { ToolActionEvent } from "./toolbar-action";
import { UIToolbar } from "./toolbar.component";
import { UIButtonTool } from "./tools/button-tool/button-tool.component";
import { UIButtonGroupTool } from "./tools/button-group-tool/button-group-tool.component";
import { UIDropdownTool } from "./tools/dropdown-tool/dropdown-tool.component";
import { UISelectTool } from "./tools/select-tool/select-tool.component";
import { UISeparatorTool } from "./tools/separator-tool/separator-tool.component";
import { UITemplateTool } from "./tools/template-tool/template-tool.component";
import { UIToggleGroupTool } from "./tools/toggle-group-tool/toggle-group-tool.component";
import { UIToggleTool } from "./tools/toggle-tool/toggle-tool.component";

// ── Basic demo ────────────────────────────────────────────────────────

@Component({
  selector: "ui-toolbar-basic-demo",
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .action-log {
        font-size: 0.875rem;
        color: #1d232b;
        background: #f7f8fa;
        padding: 6px 10px;
        border-radius: 4px;
      }
    `,
  ],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 16px; background: #fff; color: #1d232b;"
    >
      <ui-toolbar (toolAction)="onAction($event)">
        <ui-button-tool
          id="undo"
          label="Undo"
          [icon]="icons.Undo"
          tooltip="Undo"
        />
        <ui-button-tool
          id="redo"
          label="Redo"
          [icon]="icons.Redo"
          tooltip="Redo"
        />
        <ui-separator-tool id="sep1" />
        <ui-button-tool
          id="save"
          label="Save"
          [icon]="icons.Save"
          tooltip="Save"
        />
        <ui-button-tool
          id="delete"
          label="Delete"
          [icon]="icons.Trash"
          [disabled]="true"
          tooltip="Delete (disabled)"
        />
      </ui-toolbar>
      @if (lastAction()) {
        <p class="action-log">
          Last action: <strong>{{ lastAction() }}</strong>
        </p>
      }
    </div>
  `,
})
class UIToolbarBasicDemo {
  protected readonly icons = {
    Undo: UIIcons.Lucide.Arrows.Undo,
    Redo: UIIcons.Lucide.Arrows.Redo,
    Save: UIIcons.Lucide.Files.Save,
    Trash: UIIcons.Lucide.Files.Trash,
  } as const;

  protected readonly lastAction = signal<string | null>(null);

  protected onAction(event: ToolActionEvent): void {
    this.lastAction.set(event.itemId);
  }
}

// ── Toggle tools demo ─────────────────────────────────────────────────

@Component({
  selector: "ui-toolbar-toggle-demo",
  standalone: true,
  imports: [UIToolbar, UIToggleTool, UIToggleGroupTool, UISeparatorTool],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .action-log {
        font-size: 0.875rem;
        color: #1d232b;
        background: #f7f8fa;
        padding: 6px 10px;
        border-radius: 4px;
      }
    `,
  ],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 16px; background: #fff; color: #1d232b;"
    >
      <p style="margin: 0; font-size: 0.875rem; color: #1d232b;">
        Standalone toggle tools + radio-style toggle group:
      </p>
      <ui-toolbar (toolAction)="onAction($event)">
        <ui-toggle-tool
          id="bold"
          label="B"
          [icon]="icons.Bold"
          tooltip="Bold"
          [(checked)]="isBold"
        />
        <ui-toggle-tool
          id="italic"
          label="I"
          [icon]="icons.Italic"
          tooltip="Italic"
          [(checked)]="isItalic"
        />
        <ui-toggle-tool
          id="underline"
          label="U"
          [icon]="icons.Underline"
          tooltip="Underline"
          [(checked)]="isUnderline"
        />
        <ui-separator-tool id="sep1" />
        <ui-toggle-group-tool id="alignment">
          <ui-toggle-tool
            id="align-left"
            label="Left"
            [icon]="icons.AlignLeft"
            tooltip="Align left"
          />
          <ui-toggle-tool
            id="align-center"
            label="Center"
            [icon]="icons.AlignCenter"
            tooltip="Align centre"
          />
          <ui-toggle-tool
            id="align-right"
            label="Right"
            [icon]="icons.AlignRight"
            tooltip="Align right"
          />
        </ui-toggle-group-tool>
      </ui-toolbar>
      @if (lastAction()) {
        <p class="action-log">
          Last action: <strong>{{ lastAction() }}</strong> — bold={{
            isBold()
          }}, italic={{ isItalic() }}, underline={{ isUnderline() }}
        </p>
      }
    </div>
  `,
})
class UIToolbarToggleDemo {
  protected readonly icons = {
    Bold: UIIcons.Lucide.Text.Bold,
    Italic: UIIcons.Lucide.Text.Italic,
    Underline: UIIcons.Lucide.Text.Underline,
    AlignLeft: UIIcons.Lucide.Text.TextAlignStart,
    AlignCenter: UIIcons.Lucide.Text.TextAlignCenter,
    AlignRight: UIIcons.Lucide.Text.TextAlignEnd,
  } as const;

  protected readonly isBold = signal(false);
  protected readonly isItalic = signal(false);
  protected readonly isUnderline = signal(false);
  protected readonly lastAction = signal<string | null>(null);

  protected onAction(event: ToolActionEvent): void {
    this.lastAction.set(event.itemId);
  }
}

// ── Dropdown + Select demo ─────────────────────────────────────────────

@Component({
  selector: "ui-toolbar-dropdowns-demo",
  standalone: true,
  imports: [UIToolbar, UIDropdownTool, UISelectTool],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .action-log {
        font-size: 0.875rem;
        color: #1d232b;
        background: #f7f8fa;
        padding: 6px 10px;
        border-radius: 4px;
      }
    `,
  ],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 16px; background: #fff; color: #1d232b;"
    >
      <ui-toolbar (toolAction)="onAction($event)">
        <ui-dropdown-tool id="insert" label="Insert" [items]="insertItems" />
        <ui-select-tool
          id="font-size"
          label="Size"
          [options]="fontSizeOptions"
          [(value)]="fontSize"
        />
      </ui-toolbar>
      @if (lastAction()) {
        <p class="action-log">
          Last action: <strong>{{ lastAction() }}</strong>
        </p>
      }
    </div>
  `,
})
class UIToolbarDropdownsDemo {
  protected readonly insertItems = [
    { id: "table", label: "Table" },
    { id: "image", label: "Image" },
    { id: "link", label: "Link" },
    { id: "code-block", label: "Code Block" },
  ];

  protected readonly fontSizeOptions: SelectOption[] = [
    { value: "12", label: "12px" },
    { value: "14", label: "14px" },
    { value: "16", label: "16px" },
    { value: "18", label: "18px" },
    { value: "24", label: "24px" },
  ];

  protected readonly fontSize = signal("14");
  protected readonly lastAction = signal<string | null>(null);

  protected onAction(event: ToolActionEvent): void {
    this.lastAction.set(event.itemId);
  }
}

// ── Template tool demo ─────────────────────────────────────────────────

@Component({
  selector: "ui-toolbar-template-demo",
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UITemplateTool],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .action-log {
        font-size: 0.875rem;
        color: #1d232b;
        background: #f7f8fa;
        padding: 6px 10px;
        border-radius: 4px;
      }
    `,
    `
      .zoom-display {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        font-size: 0.8125rem;
        color: #1d232b;
        background: #f7f8fa;
        border: 1px solid #cdd5df;
        border-radius: 4px;
        font-family: monospace;
      }
    `,
  ],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 16px; background: #fff; color: #1d232b;"
    >
      <p style="margin: 0; font-size: 0.875rem; color: #1d232b;">
        Custom template tool used to display live zoom level:
      </p>
      <ui-toolbar (toolAction)="onAction($event)">
        <ui-button-tool
          id="zoom-out"
          [icon]="icons.ZoomOut"
          tooltip="Zoom out"
          (click)="changeZoom(-10)"
        />
        <ui-template-tool id="zoom-display" label="Zoom">
          <ng-template let-tool>
            <span class="zoom-display">{{ zoom() }}%</span>
          </ng-template>
        </ui-template-tool>
        <ui-button-tool
          id="zoom-in"
          [icon]="icons.ZoomIn"
          tooltip="Zoom in"
          (click)="changeZoom(10)"
        />
      </ui-toolbar>
    </div>
  `,
})
class UIToolbarTemplateDemo {
  protected readonly icons = {
    ZoomIn: UIIcons.Lucide.Photography.ZoomIn,
    ZoomOut: UIIcons.Lucide.Photography.ZoomOut,
  } as const;

  protected readonly zoom = signal(100);
  protected readonly lastAction = signal<string | null>(null);

  protected changeZoom(delta: number): void {
    this.zoom.update((z) => Math.min(400, Math.max(25, z + delta)));
  }

  protected onAction(event: ToolActionEvent): void {
    this.lastAction.set(event.itemId);
  }
}

// ── Button group demo ─────────────────────────────────────────────────

@Component({
  selector: "ui-toolbar-button-group-demo",
  standalone: true,
  imports: [UIToolbar, UIButtonGroupTool, UIButtonTool, UISeparatorTool],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .action-log {
        font-size: 0.875rem;
        color: #1d232b;
        background: #f7f8fa;
        padding: 6px 10px;
        border-radius: 4px;
      }
    `,
  ],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 16px; background: #fff; color: #1d232b;"
    >
      <p style="margin: 0; font-size: 0.875rem; color: #1d232b;">
        UIButtonGroupTool renders children with a shared border:
      </p>
      <ui-toolbar (toolAction)="onAction($event)">
        <ui-button-group-tool id="undo-redo">
          <ui-button-tool id="undo" [icon]="icons.Undo" tooltip="Undo" />
          <ui-button-tool id="redo" [icon]="icons.Redo" tooltip="Redo" />
        </ui-button-group-tool>
        <ui-separator-tool id="sep1" />
        <ui-button-group-tool id="clipboard">
          <ui-button-tool id="cut" [icon]="icons.Scissors" tooltip="Cut" />
          <ui-button-tool id="copy" [icon]="icons.Copy" tooltip="Copy" />
          <ui-button-tool id="paste" [icon]="icons.Clipboard" tooltip="Paste" />
        </ui-button-group-tool>
      </ui-toolbar>
      @if (lastAction()) {
        <p class="action-log">
          Last action: <strong>{{ lastAction() }}</strong>
        </p>
      }
    </div>
  `,
})
class UIToolbarButtonGroupDemo {
  protected readonly icons = {
    Undo: UIIcons.Lucide.Arrows.Undo,
    Redo: UIIcons.Lucide.Arrows.Redo,
    Scissors: UIIcons.Lucide.Tools.Scissors,
    Copy: UIIcons.Lucide.Text.Copy,
    Clipboard: UIIcons.Lucide.Text.Clipboard,
  } as const;

  protected readonly lastAction = signal<string | null>(null);

  protected onAction(event: ToolActionEvent): void {
    this.lastAction.set(event.itemId);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<UIToolbar> = {
  title: "@theredhead/UI Kit/Toolbar",
  component: UIToolbar,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        UIToolbarBasicDemo,
        UIToolbarToggleDemo,
        UIToolbarDropdownsDemo,
        UIToolbarTemplateDemo,
        UIToolbarButtonGroupDemo,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIToolbar>;

// ── Stories ───────────────────────────────────────────────────────────

/** Basic toolbar with button tools, a separator, and a disabled item. */
export const BasicButtons: Story = {
  render: () => ({
    template: `<ui-toolbar-basic-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toolbar (toolAction)="onAction($event)">
  <ui-button-tool id="undo" label="Undo" [icon]="UIIcons.Lucide.Arrows.Undo" tooltip="Undo" />
  <ui-button-tool id="redo" label="Redo" [icon]="UIIcons.Lucide.Arrows.Redo" tooltip="Redo" />
  <ui-separator-tool id="sep1" />
  <ui-button-tool id="save" label="Save" [icon]="UIIcons.Lucide.Files.Save" tooltip="Save" />
</ui-toolbar>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIToolbar, UIButtonTool, UISeparatorTool,
  type ToolActionEvent,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  template: \`...\`,
})
export class ExampleComponent {
  protected readonly UIIcons = UIIcons;

  protected onAction(event: ToolActionEvent): void {
    console.log('Action:', event.itemId);
  }
}
        `,
      },
    },
  },
};

/** Standalone toggle tools and a radio-style UIToggleGroupTool. */
export const ToggleTools: Story = {
  render: () => ({
    template: `<ui-toolbar-toggle-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toolbar (toolAction)="onAction($event)">
  <ui-toggle-tool id="bold" label="B" [icon]="UIIcons.Lucide.Text.Bold" [(checked)]="isBold" />
  <ui-toggle-tool id="italic" label="I" [icon]="UIIcons.Lucide.Text.Italic" [(checked)]="isItalic" />
  <ui-separator-tool id="sep1" />
  <ui-toggle-group-tool id="alignment">
    <ui-toggle-tool id="align-left" [icon]="UIIcons.Lucide.Text.AlignLeft" />
    <ui-toggle-tool id="align-center" [icon]="UIIcons.Lucide.Text.TextAlignCenter" />
    <ui-toggle-tool id="align-right" [icon]="UIIcons.Lucide.Text.AlignRight" />
  </ui-toggle-group-tool>
</ui-toolbar>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIToggleTool, UIToggleGroupTool, UISeparatorTool,
  UIIcons, type ToolActionEvent,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIToggleTool, UIToggleGroupTool, UISeparatorTool],
  template: \`...\`,
})
export class ExampleComponent {
  protected readonly UIIcons = UIIcons;
  protected readonly isBold = signal(false);
  protected readonly isItalic = signal(false);
}
        `,
      },
    },
  },
};

/** Dropdown panel and wrapped select control. */
export const DropdownAndSelect: Story = {
  render: () => ({
    template: `<ui-toolbar-dropdowns-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toolbar (toolAction)="onAction($event)">
  <ui-dropdown-tool
    id="insert"
    label="Insert"
    [items]="[
      { id: 'table', label: 'Table' },
      { id: 'image', label: 'Image' },
    ]"
  />
  <ui-select-tool
    id="font-size"
    label="Size"
    [options]="fontSizeOptions"
    [(value)]="fontSize"
  />
</ui-toolbar>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIDropdownTool, UISelectTool,
  type ToolActionEvent, type SelectOption,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIDropdownTool, UISelectTool],
  template: \`...\`,
})
export class ExampleComponent {
  protected readonly fontSizeOptions: SelectOption[] = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
  ];
  protected readonly fontSize = signal('14');

  protected onAction(event: ToolActionEvent): void {
    console.log('Action:', event.itemId, (event.itemRef as UIDropdownTool).selectedItemId());
  }
}
        `,
      },
    },
  },
};

/** Consumer-provided template rendered inside the toolbar. */
export const TemplateTool: Story = {
  render: () => ({
    template: `<ui-toolbar-template-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toolbar>
  <ui-button-tool id="zoom-out" [icon]="UIIcons.Lucide.Navigation.ZoomOut" />
  <ui-template-tool id="zoom-display">
    <ng-template let-tool>
      <span style="padding: 4px 8px; font-size: 0.8125rem;">{{ zoom() }}%</span>
    </ng-template>
  </ui-template-tool>
  <ui-button-tool id="zoom-in" [icon]="UIIcons.Lucide.Navigation.ZoomIn" />
</ui-toolbar>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIButtonTool, UITemplateTool, UIIcons,
} from '@theredhead/lucid-kit';
        `,
      },
    },
  },
};

/** Groups of button tools with a shared border and separator. */
export const ButtonGroups: Story = {
  render: () => ({
    template: `<ui-toolbar-button-group-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toolbar (toolAction)="onAction($event)">
  <ui-button-group-tool id="undo-redo">
    <ui-button-tool id="undo" [icon]="UIIcons.Lucide.Arrows.Undo" />
    <ui-button-tool id="redo" [icon]="UIIcons.Lucide.Arrows.Redo" />
  </ui-button-group-tool>
  <ui-separator-tool id="sep1" />
  <ui-button-group-tool id="clipboard">
    <ui-button-tool id="cut" [icon]="UIIcons.Lucide.Tools.Scissors" />
    <ui-button-tool id="copy" [icon]="UIIcons.Lucide.Files.Copy" />
    <ui-button-tool id="paste" [icon]="UIIcons.Lucide.Files.Clipboard" />
  </ui-button-group-tool>
</ui-toolbar>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIToolbar, UIButtonGroupTool, UIButtonTool, UISeparatorTool,
  UIIcons, type ToolActionEvent,
} from '@theredhead/lucid-kit';
        `,
      },
    },
  },
};
