/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIButton } from "../button/button.component";
import { PopoverService } from "./popover.service";
import { PopoverRef, type UIPopoverContent } from "./popover.types";

// ── Popover content components ─────────────────────────────────────

/** Simple tooltip-style content. */
@Component({
  selector: "ui-story-tooltip-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 0.75rem 1rem;
        max-width: 18rem;
      }
      .tooltip-title {
        margin: 0 0 0.25rem;
        font-size: 0.8125rem;
        font-weight: 600;
      }
      .tooltip-body {
        margin: 0;
        font-size: 0.75rem;
        line-height: 1.5;
        opacity: 0.75;
      }
    `,
  ],
  template: `
    <p class="tooltip-title">{{ title() }}</p>
    <p class="tooltip-body">{{ body() }}</p>
  `,
})
class StoryTooltipContent implements UIPopoverContent {
  readonly popoverRef = inject(PopoverRef);
  readonly title = input("Keyboard Shortcut");
  readonly body = input("Press ⌘K to open the command palette.");
}

/** Context menu with a list of actions. */
@Component({
  selector: "ui-story-context-menu",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
      .menu-list {
        list-style: none;
        margin: 0;
        padding: 0.25rem 0;
        min-width: 10rem;
      }
      .menu-item {
        padding: 0.5rem 1rem;
        font-size: 0.8125rem;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        color: inherit;
        border-radius: 0;
      }
      .menu-item:hover {
        background: var(--theredhead-primary, #4f46e5);
        color: #fff;
      }
      .menu-separator {
        height: 1px;
        background: var(--theredhead-outline-variant, #d7dce2);
        margin: 0.25rem 0;
      }
    `,
  ],
  template: `
    <ul class="menu-list" role="menu">
      @for (item of items(); track item.label) {
        @if (item.separator) {
          <li class="menu-separator" role="separator"></li>
        }
        <li>
          <button
            class="menu-item"
            role="menuitem"
            (click)="select(item.action)"
          >
            {{ item.label }}
          </button>
        </li>
      }
    </ul>
  `,
})
class StoryContextMenu implements UIPopoverContent<string> {
  readonly popoverRef = inject(PopoverRef<string>);

  readonly items = input<
    readonly { label: string; action: string; separator?: boolean }[]
  >([
    { label: "Cut", action: "cut" },
    { label: "Copy", action: "copy" },
    { label: "Paste", action: "paste" },
    { label: "Delete", action: "delete", separator: true },
  ]);

  readonly chosen = output<string>();

  select(action: string): void {
    this.chosen.emit(action);
    this.popoverRef.close(action);
  }
}

/** Action menu with icon-like labels. */
@Component({
  selector: "ui-story-action-menu",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 0.5rem;
        min-width: 12rem;
      }
      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: none;
        background: none;
        color: inherit;
        font-size: 0.8125rem;
        cursor: pointer;
        border-radius: 0.25rem;
        text-align: left;
      }
      .action-btn:hover {
        background: var(--theredhead-surface-variant, #f0f0f5);
      }
      .action-icon {
        font-size: 1rem;
        opacity: 0.7;
      }
    `,
  ],
  template: `
    <button class="action-btn" (click)="pick('share')">
      <span class="action-icon">🔗</span> Share Link
    </button>
    <button class="action-btn" (click)="pick('duplicate')">
      <span class="action-icon">📋</span> Duplicate
    </button>
    <button class="action-btn" (click)="pick('archive')">
      <span class="action-icon">📦</span> Archive
    </button>
    <button class="action-btn" (click)="pick('delete')">
      <span class="action-icon">🗑️</span> Delete
    </button>
  `,
})
class StoryActionMenu implements UIPopoverContent<string> {
  readonly popoverRef = inject(PopoverRef<string>);

  pick(action: string): void {
    this.popoverRef.close(action);
  }
}

// ── Demo wrapper components ────────────────────────────────────────

const DEMO_STYLES = `
  :host { display: block; max-width: 460px; }
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
`;

@Component({
  selector: "ui-popover-tooltip-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [DEMO_STYLES],
  template: `
    <ui-button #anchor variant="outlined" (click)="open()">
      Hover info ℹ️
    </ui-button>
    <p style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.7;">
      Click the button to show a rich tooltip popover.
    </p>
  `,
})
class TooltipDemo {
  private readonly popover = inject(PopoverService);
  private readonly anchorRef = viewChild.required("anchor", {
    read: ElementRef,
  });

  open(): void {
    this.popover.openPopover({
      component: StoryTooltipContent,
      anchor: this.anchorRef().nativeElement,
      ariaLabel: "Keyboard shortcut tooltip",
    });
  }
}

@Component({
  selector: "ui-popover-context-menu-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [DEMO_STYLES],
  template: `
    <ui-button #anchor variant="filled" (click)="open()">
      Right-click style menu
    </ui-button>
    @if (lastAction()) {
      <div class="story-output">
        <strong>Chosen action:</strong> {{ lastAction() }}
      </div>
    }
  `,
})
class ContextMenuDemo {
  private readonly popover = inject(PopoverService);
  private readonly anchorRef = viewChild.required("anchor", {
    read: ElementRef,
  });
  protected readonly lastAction = signal<string | undefined>(undefined);

  open(): void {
    this.popover
      .openPopover<StoryContextMenu, string>({
        component: StoryContextMenu,
        anchor: this.anchorRef().nativeElement,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
        ariaLabel: "Context menu",
        outputs: {
          chosen: (action: string) => this.lastAction.set(action),
        },
      })
      .closed.subscribe((action) => {
        if (action) this.lastAction.set(action);
      });
  }
}

@Component({
  selector: "ui-popover-action-menu-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [DEMO_STYLES],
  template: `
    <ui-button #anchor variant="ghost" (click)="open()"> ⋮ Actions </ui-button>
    @if (lastAction()) {
      <div class="story-output">
        <strong>Selected:</strong> {{ lastAction() }}
      </div>
    }
  `,
})
class ActionMenuDemo {
  private readonly popover = inject(PopoverService);
  private readonly anchorRef = viewChild.required("anchor", {
    read: ElementRef,
  });
  protected readonly lastAction = signal<string | undefined>(undefined);

  open(): void {
    this.popover
      .openPopover<StoryActionMenu, string>({
        component: StoryActionMenu,
        anchor: this.anchorRef().nativeElement,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
        ariaLabel: "Actions menu",
      })
      .closed.subscribe((action) => {
        if (action) this.lastAction.set(action);
      });
  }
}

@Component({
  selector: "ui-popover-placement-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        padding: 4rem 2rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, auto);
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        max-width: 460px;
        margin: 0 auto;
      }
      .story-output {
        margin-top: 2rem;
        text-align: center;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
      }
    `,
  ],
  template: `
    <div class="grid">
      <!-- Row 1 -->
      <span></span>
      <ui-button variant="outlined" (click)="open($event, 'top', 'center')">
        ↑ Top
      </ui-button>
      <span></span>

      <!-- Row 2 -->
      <ui-button variant="outlined" (click)="open($event, 'center', 'start')">
        ← Left
      </ui-button>
      <ui-button variant="filled" (click)="open($event, 'auto', 'auto')">
        ✦ Auto
      </ui-button>
      <ui-button variant="outlined" (click)="open($event, 'center', 'end')">
        Right →
      </ui-button>

      <!-- Row 3 -->
      <span></span>
      <ui-button variant="outlined" (click)="open($event, 'bottom', 'center')">
        ↓ Bottom
      </ui-button>
      <span></span>
    </div>

    @if (lastPlacement()) {
      <div class="story-output">
        <strong>Alignment:</strong> {{ lastPlacement() }}
      </div>
    }
  `,
})
class PlacementDemo {
  private readonly popover = inject(PopoverService);
  protected readonly lastPlacement = signal<string | undefined>(undefined);

  open(event: Event, vAlign: string, hAlign: string): void {
    const anchor = event.currentTarget as HTMLElement;
    const label = `vertical: ${vAlign}, horizontal: ${hAlign}`;
    this.lastPlacement.set(label);
    this.popover.openPopover({
      component: StoryTooltipContent,
      anchor,
      verticalAxisAlignment: vAlign as any,
      horizontalAxisAlignment: hAlign as any,
      inputs: {
        title: `Alignment`,
        body: `vertical: ${vAlign}, horizontal: ${hAlign}`,
      },
      ariaLabel: `${vAlign} ${hAlign} tooltip`,
    });
  }
}

@Component({
  selector: "ui-popover-manual-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [DEMO_STYLES],
  template: `
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <ui-button #anchor variant="filled" (click)="toggle()">
        {{ isOpen() ? "Close" : "Open" }} Persistent Popover
      </ui-button>
    </div>
    <p style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.7;">
      This popover uses <code>closeOnOutsideClick: false</code> — it stays open
      until explicitly closed by the button.
    </p>
  `,
})
class ManualDismissDemo {
  private readonly popover = inject(PopoverService);
  private readonly anchorRef = viewChild.required("anchor", {
    read: ElementRef,
  });
  protected readonly isOpen = signal(false);
  private currentRef: PopoverRef | null = null;

  toggle(): void {
    if (this.currentRef && !this.currentRef.isClosed) {
      this.currentRef.close();
      this.currentRef = null;
      this.isOpen.set(false);
      return;
    }

    this.currentRef = this.popover.openPopover({
      component: StoryTooltipContent,
      anchor: this.anchorRef().nativeElement,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "center",
      closeOnOutsideClick: false,
      inputs: {
        title: "Persistent Popover",
        body: "I will not close when you click outside. Use the button to dismiss me.",
      },
      ariaLabel: "Persistent popover",
    });
    this.isOpen.set(true);

    this.currentRef.closed.subscribe(() => {
      this.isOpen.set(false);
      this.currentRef = null;
    });
  }
}

// ── Storybook meta & stories ───────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          '`PopoverService` provides an imperative API for opening floating popover panels anchored to any DOM element. It uses the native Popover API (`popover="auto"` or `popover="manual"`) for stacking and light-dismiss behaviour.',
          "",
          "## Key Features",
          "",
          "- **Anchored positioning** — popovers attach to a trigger element with configurable vertical and horizontal alignment",
          "- **Component projection** — pass any Angular component as the popover content; forward `inputs` and `outputs`",
          "- **Light dismiss** — by default, clicking outside closes the popover; set `closeOnOutsideClick: false` for manual mode",
          "- **Result subscription** — `ref.closed` is an `Observable` that emits the close value (useful for menus and confirmations)",
          "- **Placement options** — `verticalAxisAlignment` (`top`, `bottom`, `center`, `auto`) and `horizontalAxisAlignment` (`start`, `end`, `center`, `auto`)",
          "",
          "## Usage",
          "",
          "```ts",
          "private readonly popover = inject(PopoverService);",
          "",
          "this.popover.openPopover({",
          "  component: MyContent,",
          "  anchor: buttonElement,",
          '  ariaLabel: "My popover",',
          '  inputs: { title: "Hello" },',
          "  outputs: { chosen: (v) => console.log(v) },",
          "});",
          "```",
          "",
          "## PopoverConfig",
          "",
          "| Option | Type | Default | Description |",
          "|--------|------|---------|-------------|",
          "| `component` | `Type<T>` | *(required)* | The Angular component to render |",
          "| `anchor` | `HTMLElement` | *(required)* | The DOM element to anchor to |",
          '| `verticalAxisAlignment` | `"top" \\| "bottom" \\| "center" \\| "auto"` | `"auto"` | Vertical placement |',
          '| `horizontalAxisAlignment` | `"start" \\| "end" \\| "center" \\| "auto"` | `"auto"` | Horizontal placement |',
          "| `closeOnOutsideClick` | `boolean` | `true` | Whether clicking outside closes the popover |",
          "| `inputs` | `Record<string, any>` | — | Input bindings forwarded to the component |",
          "| `outputs` | `Record<string, Function>` | — | Output handlers wired to the component |",
          "| `ariaLabel` | `string` | — | Accessible label for the popover container |",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        TooltipDemo,
        ContextMenuDemo,
        ActionMenuDemo,
        PlacementDemo,
        ManualDismissDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Rich tooltip** — A popover used as an enhanced tooltip with a title
 * and body text. Opens on button click and auto-dismisses on outside click.
 */
export const RichTooltip: Story = {
  render: () => ({
    template: `<ui-popover-tooltip-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `private readonly popover = inject(PopoverService);

this.popover.openPopover({
  component: TooltipContent,
  anchor: buttonElement,
  ariaLabel: 'Keyboard shortcut tooltip',
});`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Context menu** — A popover rendering Cut / Copy / Paste / Delete
 * actions. Demonstrates output wiring via the `outputs` config and
 * subscribing to the `closed` observable for the chosen action.
 */
export const ContextMenu: Story = {
  render: () => ({
    template: `<ui-popover-context-menu-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.popover
  .openPopover<ContextMenu, string>({
    component: ContextMenu,
    anchor: buttonElement,
    verticalAxisAlignment: 'bottom',
    horizontalAxisAlignment: 'center',
    ariaLabel: 'Context menu',
    outputs: {
      chosen: (action: string) => console.log(action),
    },
  })
  .closed.subscribe((action) => {
    if (action) { /* handle */ }
  });`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Action menu** — A dropdown-style action menu anchored to a ghost
 * button. Selecting an action closes the popover and emits the result.
 */
export const ActionMenu: Story = {
  render: () => ({
    template: `<ui-popover-action-menu-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.popover
  .openPopover<ActionMenu, string>({
    component: ActionMenu,
    anchor: buttonElement,
    verticalAxisAlignment: 'bottom',
    horizontalAxisAlignment: 'center',
    ariaLabel: 'Actions menu',
  })
  .closed.subscribe((action) => {
    if (action) { /* handle */ }
  });`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Placement** — Four buttons demonstrate different popover placements:
 * top, bottom, left, and right. Click each button to see the popover
 * appear on that side of the trigger.
 */
export const Placement: Story = {
  render: () => ({
    template: `<ui-popover-placement-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.popover.openPopover({
  component: TooltipContent,
  anchor: buttonElement,
  verticalAxisAlignment: 'top',    // 'top' | 'bottom' | 'center' | 'auto'
  horizontalAxisAlignment: 'center', // 'start' | 'end' | 'center' | 'auto'
  inputs: {
    title: 'Alignment',
    body: 'vertical: top, horizontal: center',
  },
});`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Manual dismiss** — The popover uses `popover="manual"` so it stays
 * open even when clicking outside. It must be dismissed programmatically
 * via `ref.close()`. Useful for persistent tooltips or step-by-step
 * onboarding flows.
 */
export const ManualDismiss: Story = {
  render: () => ({
    template: `<ui-popover-manual-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `const ref = this.popover.openPopover({
  component: TooltipContent,
  anchor: buttonElement,
  closeOnOutsideClick: false,
  inputs: {
    title: 'Persistent Popover',
    body: 'Will not close on outside click.',
  },
  ariaLabel: 'Persistent popover',
});

// Dismiss programmatically:
ref.close();`,
        language: "typescript",
      },
    },
  },
};
