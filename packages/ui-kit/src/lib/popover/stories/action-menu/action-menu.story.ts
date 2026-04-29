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

/** Action menu with icon-like labels. */
@Component({
  selector: "ui-story-action-menu",
  standalone: true,
  imports: [UIIcon],
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
      <ui-icon [svg]="icons.Account.Link" [size]="16" /> Share Link
    </button>
    <button class="action-btn" (click)="pick('duplicate')">
      <ui-icon [svg]="icons.Text.Copy" [size]="16" /> Duplicate
    </button>
    <button class="action-btn" (click)="pick('archive')">
      <ui-icon [svg]="icons.Files.Archive" [size]="16" /> Archive
    </button>
    <button class="action-btn" (click)="pick('delete')">
      <ui-icon [svg]="icons.Files.Trash2" [size]="16" /> Delete
    </button>
  `,
})
class StoryActionMenu implements UIPopoverContent<string> {
  protected readonly icons = UIIcons.Lucide;
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
  selector: "ui-popover-action-menu-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./action-menu.story.scss",
  templateUrl: "./action-menu.story.html",
})
export class ActionMenuDemo {
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
