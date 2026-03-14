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
    selector: 'ui-badge-column',
    standalone: true,
    providers: [
        {
            provide: UITableViewColumn,
            useExisting: forwardRef(() => UIBadgeColumn),
        },
    ],
    templateUrl: './badge-column.component.html',
    styleUrl: './badge-column.component.scss',
})
export class UIBadgeColumn extends UITableViewColumn {
    public variant = input<'neutral' | 'success' | 'warning' | 'danger'>('neutral');

    @ViewChild('cell', { static: true })
    public readonly cellTemplate!: TemplateRef<UITableViewCellContext>;

    protected getCellValue(row: unknown): unknown {
        return this.getValue(row);
    }
}
