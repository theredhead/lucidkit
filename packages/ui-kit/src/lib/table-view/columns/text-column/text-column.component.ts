import {
    Component,
    forwardRef,
    input,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import {
    UITableViewCellContext,
    UITableViewColumn,
} from '../table-column.directive';

@Component({
    selector: 'ui-text-column',
    standalone: true,
    providers: [
        {
            provide: UITableViewColumn,
            useExisting: forwardRef(() => UITextColumn),
        },
    ],
    templateUrl: './text-column.component.html',
    styleUrl: './text-column.component.scss',
})
export class UITextColumn extends UITableViewColumn {
    public truncate = input<boolean>(false);

    @ViewChild('cell', { static: true })
    public readonly cellTemplate!: TemplateRef<UITableViewCellContext>;

    protected getCellValue(row: unknown): unknown {
        return this.getValue(row);
    }

    protected stringValue(row: unknown): string {
        return String(this.getCellValue(row) ?? '');
    }
}
