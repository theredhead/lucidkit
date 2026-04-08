import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  viewChild,
} from '@angular/core';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';

import { UISurface, UI_DEFAULT_SURFACE_TYPE } from '@theredhead/foundation';
import { UITableBodyBase } from './table-body-base';

/**
 * CDK virtual-scroll table body strategy.
 *
 * Renders rows inside a {@link CdkVirtualScrollViewport} using
 * `*cdkVirtualFor`. Best for large datasets where only a window of
 * rows should be in the DOM at a time.
 *
 * @internal
 */
@Component({
  selector: 'ui-cdk-virtual-table-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  providers: [
    { provide: UI_DEFAULT_SURFACE_TYPE, useValue: 'table-body' },
    { provide: UITableBodyBase, useExisting: forwardRef(() => UICdkVirtualTableBody) },
  ],
  imports: [ScrollingModule, NgTemplateOutlet],
  templateUrl: './cdk-virtual-table-body.component.html',
  styleUrl: './table-body.scss',
  host: { class: 'ui-cdk-virtual-table-body' },
})
export class UICdkVirtualTableBody extends UITableBodyBase {
  // ── Queries ──

  /** CDK viewport reference for programmatic scrolling. */
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  // ── Public methods ──

  public scrollToIndex(index: number): void {
    const vp = this.viewport();
    if (!vp) return;

    const itemSize = this.rowHeight();
    const viewportSize = vp.getViewportSize();
    if (viewportSize <= 0) return;

    const scrollTop = vp.measureScrollOffset('top');
    const rowTop = index * itemSize;
    const rowBottom = rowTop + itemSize;

    if (rowTop < scrollTop) {
      vp.scrollToOffset(rowTop);
    } else if (rowBottom > scrollTop + viewportSize) {
      vp.scrollToOffset(rowBottom - viewportSize);
    }
  }
}
