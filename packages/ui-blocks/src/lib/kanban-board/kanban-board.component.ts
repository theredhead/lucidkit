import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragPlaceholder,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import type {
  KanbanColumn,
  KanbanCard,
  KanbanCardMoveEvent,
  KanbanCardContext,
} from './kanban-board.types';

/**
 * Column-based kanban board with drag-and-drop card reordering.
 *
 * Cards can be moved within a column (reorder) or across columns
 * (transfer). Columns and cards are provided via a two-way `columns`
 * model. Project an `<ng-template>` to customise card rendering.
 *
 * ### Basic usage
 * ```html
 * <ui-kanban-board [(columns)]="columns">
 *   <ng-template let-card let-column="column">
 *     <h4>{{ card.data.title }}</h4>
 *     <p>{{ card.data.description }}</p>
 *   </ng-template>
 * </ui-kanban-board>
 * ```
 */
@Component({
  selector: 'ui-kanban-board',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
  host: {
    class: 'ui-kanban-board',
  },
})
export class UIKanbanBoard<T = unknown> {
  // ── Models ────────────────────────────────────────────────────────

  /** Column data (two-way bindable). Mutated in-place during drag operations. */
  public readonly columns = model.required<KanbanColumn<T>[]>();

  // ── Inputs ────────────────────────────────────────────────────────

  /** Accessible label for the board region. */
  public readonly ariaLabel = input<string>('Kanban board');

  // ── Content children ──────────────────────────────────────────────

  /** Optional projected template for card rendering. */
  public readonly cardTemplate = contentChild<TemplateRef<KanbanCardContext<T>>>(TemplateRef);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted after a card is moved (reorder or transfer). */
  public readonly cardMoved = output<KanbanCardMoveEvent<T>>();

  /** Emitted when a card is clicked. */
  public readonly cardClicked = output<KanbanCard<T>>();

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — handle CDK drop event. */
  protected onDrop(event: CdkDragDrop<KanbanCard<T>[]>): void {
    const card: KanbanCard<T> = event.item.data;
    const previousColumnId = event.previousContainer.id;
    const currentColumnId = event.container.id;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        currentIndex,
      );
    }

    // Trigger signal update with new array reference
    this.columns.set([...this.columns()]);

    this.cardMoved.emit({
      card,
      previousColumnId,
      currentColumnId,
      previousIndex,
      currentIndex,
    });
  }

  /** @internal — handle card click. */
  protected onCardClick(card: KanbanCard<T>): void {
    this.cardClicked.emit(card);
  }
}
