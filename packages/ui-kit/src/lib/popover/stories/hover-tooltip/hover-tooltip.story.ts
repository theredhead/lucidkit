import { Component, inject, ElementRef, viewChild, DestroyRef } from '@angular/core';
import { PopoverService, PopoverRef, UIButton } from '@theredhead/lucid-kit';

@Component({ ... })
export class HoverTooltipExample {
  private readonly popover = inject(PopoverService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchor = viewChild.required('anchor', { read: ElementRef });
  private ref: PopoverRef | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.hide());
  }

  show(): void {
    if (this.ref && !this.ref.isClosed) return;
    this.ref = this.popover.openPopover({
      component: MyTooltipContent,
      anchor: this.anchor().nativeElement,
      closeOnOutsideClick: false,
      showArrow: true,
      ariaLabel: 'Hover tooltip',
    });
  }

  hide(): void {
    this.ref?.close();
    this.ref = null;
  }
}
