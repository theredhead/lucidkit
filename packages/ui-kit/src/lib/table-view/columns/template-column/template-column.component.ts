import {
  Component,
  contentChild,
  forwardRef,
  TemplateRef,
} from "@angular/core";

import {
  UITableViewCellContext,
  UITableViewColumn,
} from "../table-column.directive";

/**
 * A table column whose cell content is defined entirely by the consumer
 * via a projected `<ng-template>`.
 *
 * The template receives the row object as the implicit context (`let-row`)
 * and the column reference as `column` – exactly like the built-in columns.
 *
 * @example
 * ```html
 * <ui-template-column key="actions" headerText="Actions">
 *   <ng-template let-row>
 *     <button (click)="edit(row)">Edit</button>
 *     <button (click)="delete(row)">Delete</button>
 *   </ng-template>
 * </ui-template-column>
 * ```
 */
@Component({
  selector: "ui-template-column",
  standalone: true,
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITemplateColumn),
    },
  ],
  template: "",
})
export class UITemplateColumn extends UITableViewColumn {
  private readonly _contentTemplate =
    contentChild.required<TemplateRef<UITableViewCellContext>>(TemplateRef);

  /**
   * The consumer-projected template, unwrapped from the signal so it
   * satisfies the base-class contract (`TemplateRef`, not `Signal`).
   *
   * The table body reads this property inside a template that is already
   * within a change-detection cycle, so the signal will have resolved by
   * the time the first row renders.
   */
  public override get cellTemplate(): TemplateRef<UITableViewCellContext> {
    return this._contentTemplate();
  }
}
