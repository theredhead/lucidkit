/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIIcon } from "../../../icon/icon.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";
import { PopoverService } from "../../popover.service";
import { PopoverRef, type UIPopoverContent } from "../../popover.types";

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
  selector: "ui-popover-context-menu-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./context-menu.story.scss",
  templateUrl: "./context-menu.story.html",
})
export class ContextMenuDemo {
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
