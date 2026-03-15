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
    background: var(--tv-surface-2, #fbfbfc);
    color: var(--tv-text, #1d232b);
    border: 1px solid var(--tv-border, #d7dce2);
    border-radius: 4px;
    font-family: var(--tv-font, monospace);
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
      placement: "bottom",
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
        placement: "bottom-start",
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
    <ui-button #anchor variant="ghost" (click)="open()">
      ⋮ Actions
    </ui-button>
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
        placement: "bottom-end",
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
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
      }
    `,
  ],
  template: `
    <div class="grid">
      <!-- Row 1 -->
      <span></span>
      <ui-button
        #topBtn
        variant="outlined"
        (click)="open(topBtn, 'top')"
      >
        ↑ Top
      </ui-button>
      <span></span>

      <!-- Row 2 -->
      <ui-button
        #leftBtn
        variant="outlined"
        (click)="open(leftBtn, 'left')"
      >
        ← Left
      </ui-button>
      <span style="padding: 1rem; text-align: center; font-size: 0.75rem; opacity: 0.6;">
        Click any<br>button
      </span>
      <ui-button
        #rightBtn
        variant="outlined"
        (click)="open(rightBtn, 'right')"
      >
        Right →
      </ui-button>

      <!-- Row 3 -->
      <span></span>
      <ui-button
        #bottomBtn
        variant="outlined"
        (click)="open(bottomBtn, 'bottom')"
      >
        ↓ Bottom
      </ui-button>
      <span></span>
    </div>

    @if (lastPlacement()) {
      <div class="story-output">
        <strong>Placement:</strong> {{ lastPlacement() }}
      </div>
    }
  `,
})
class PlacementDemo {
  private readonly popover = inject(PopoverService);
  protected readonly lastPlacement = signal<string | undefined>(undefined);

  open(anchor: HTMLElement, placement: string): void {
    this.lastPlacement.set(placement);
    this.popover.openPopover({
      component: StoryTooltipContent,
      anchor,
      placement: placement as any,
      inputs: {
        title: `Placement: ${placement}`,
        body: `This popover is placed on the "${placement}" side of the anchor button.`,
      },
      ariaLabel: `${placement} tooltip`,
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
        {{ isOpen() ? 'Close' : 'Open' }} Persistent Popover
      </ui-button>
    </div>
    <p style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.7;">
      This popover uses <code>closeOnOutsideClick: false</code> — it stays
      open until explicitly closed by the button.
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
      placement: "bottom-start",
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

/** Rich tooltip popover with title and description. */
export const RichTooltip: Story = {
  render: () => ({
    template: `<ui-popover-tooltip-demo />`,
  }),
};

/**
 * Context menu with Cut/Copy/Paste/Delete actions.
 * Demonstrates output wiring and result subscription.
 */
export const ContextMenu: Story = {
  render: () => ({
    template: `<ui-popover-context-menu-demo />`,
  }),
};

/** Dropdown action menu anchored to a ghost button. */
export const ActionMenu: Story = {
  render: () => ({
    template: `<ui-popover-action-menu-demo />`,
  }),
};

/**
 * Shows four buttons with different placement options.
 * Click any button to see the popover appear on that side.
 */
export const Placement: Story = {
  render: () => ({
    template: `<ui-popover-placement-demo />`,
  }),
};

/**
 * Popover with `closeOnOutsideClick: false` — uses `popover="manual"`
 * so it stays open until explicitly dismissed.
 */
export const ManualDismiss: Story = {
  render: () => ({
    template: `<ui-popover-manual-demo />`,
  }),
};
