import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { PopoverService } from "../../popover.service";
import { PopoverRef, type UIPopoverContent } from "../../popover.types";

@Component({
  selector: "ui-hover-tooltip-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 0.5rem 0.75rem;
        max-width: 14rem;
        font-size: 0.75rem;
        line-height: 1.4;
      }
    `,
  ],
  template: `A lightweight tooltip shown through PopoverService on hover.`,
})
class HoverTooltipContent implements UIPopoverContent<void> {
  public readonly popoverRef = inject(PopoverRef<void>);
}

@Component({
  selector: "ui-hover-tooltip-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./hover-tooltip.story.html",
  styleUrl: "./hover-tooltip.story.scss",
})
export class HoverTooltipStorySource {
  private readonly popover = inject(PopoverService);
  private readonly anchorRef = viewChild.required("anchor", {
    read: ElementRef,
  });

  private popoverRef?: PopoverRef<void>;

  public show(): void {
    if (this.popoverRef && !this.popoverRef.isClosed) {
      return;
    }

    const ref = this.popover.openPopover<HoverTooltipContent, void>({
      component: HoverTooltipContent,
      anchor: this.anchorRef().nativeElement,
      ariaLabel: "Hover tooltip",
      closeOnOutsideClick: false,
    });

    this.popoverRef = ref;
    ref.closed.subscribe(() => {
      if (this.popoverRef === ref) {
        this.popoverRef = undefined;
      }
    });
  }

  public hide(): void {
    this.popoverRef?.close();
  }
}
