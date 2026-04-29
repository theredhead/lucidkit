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

@Component({
  selector: "ui-popover-placement-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./placement.story.scss",
  templateUrl: "./placement.story.html",
})
export class PlacementDemo {
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
