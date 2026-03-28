import {
  Component,
  forwardRef,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";

import {
  UITableViewCellContext,
  UITableViewColumn,
} from "../table-column.directive";
import { UISurface } from '@theredhead/foundation';

@Component({
  selector: "ui-badge-column",
  standalone: true,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UIBadgeColumn),
    },
  ],
  templateUrl: "./badge-column.component.html",
  styleUrl: "./badge-column.component.scss",
})
export class UIBadgeColumn extends UITableViewColumn {
  public variant = input<"neutral" | "success" | "warning" | "danger">(
    "neutral",
  );

  private readonly _cellTemplate =
    viewChild.required<TemplateRef<UITableViewCellContext>>("cell");

  public override get cellTemplate(): TemplateRef<UITableViewCellContext> {
    return this._cellTemplate();
  }

  protected getCellValue(row: unknown): unknown {
    return this.getValue(row);
  }
}
