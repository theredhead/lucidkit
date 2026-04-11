import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";
import { UITableBodyBase } from "./table-body-base";

/**
 * Plain-scroll table body strategy.
 *
 * Renders all rows in a simple scrollable `<div>` using Angular's
 * built-in `@for` loop. No CDK dependency.
 *
 * @internal
 */
@Component({
  selector: "ui-plain-table-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [
    { provide: UI_DEFAULT_SURFACE_TYPE, useValue: "table-body" },
    {
      provide: UITableBodyBase,
      useExisting: forwardRef(() => UIPlainTableBody),
    },
  ],
  imports: [NgTemplateOutlet],
  templateUrl: "./plain-table-body.component.html",
  styleUrl: "./table-body.scss",
  host: { class: "ui-plain-table-body" },
})
export class UIPlainTableBody extends UITableBodyBase {
  // ── Queries ──

  private readonly scrollContainer =
    viewChild<ElementRef<HTMLElement>>("scrollContainer");

  // ── Public methods ──

  public scrollToIndex(index: number): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const itemSize = this.rowHeight();
    const viewportSize = container.clientHeight;
    if (viewportSize <= 0) return;

    const scrollTop = container.scrollTop;
    const rowTop = index * itemSize;
    const rowBottom = rowTop + itemSize;

    if (rowTop < scrollTop) {
      container.scrollTop = rowTop;
    } else if (rowBottom > scrollTop + viewportSize) {
      container.scrollTop = rowBottom - viewportSize;
    }
  }
}
