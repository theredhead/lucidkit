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
import { UISurface } from '@theredhead/lucid-foundation';

@Component({
  selector: "ui-number-column",
  standalone: true,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UINumberColumn),
    },
  ],
  templateUrl: "./number-column.component.html",
  styleUrl: "./number-column.component.scss",
})
export class UINumberColumn extends UITableViewColumn {
  public format = input<Intl.NumberFormatOptions>({});
  public locale = input<string | undefined>(undefined);
  public fallback = input<string>("");

  private readonly _cellTemplate =
    viewChild.required<TemplateRef<UITableViewCellContext>>("cell");

  public override get cellTemplate(): TemplateRef<UITableViewCellContext> {
    return this._cellTemplate();
  }

  protected getCellValue(row: unknown): unknown {
    return this.getValue(row);
  }

  protected formattedValue(row: unknown): string {
    const value = this.getCellValue(row);

    if (value === null || value === undefined || value === "") {
      return this.fallback();
    }

    const numeric = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numeric)) {
      return this.fallback() || String(value);
    }

    return new Intl.NumberFormat(this.locale(), this.format()).format(numeric);
  }
}
