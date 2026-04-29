import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, viewChild } from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { PopoverService } from "../../popover.service";
import { PopoverRef, type UIPopoverContent } from "../../popover.types";

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
  selector: "ui-popover-manual-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./manual-dismiss.story.scss",
  templateUrl: "./manual-dismiss.story.html",
})
export class ManualDismissDemo {
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
