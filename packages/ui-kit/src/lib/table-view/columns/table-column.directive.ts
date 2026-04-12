import {
    Directive,
    input,
    TemplateRef,
} from '@angular/core';

export interface UITableViewCellContext<T = unknown> {
    $implicit: T;
    column: UITableViewColumn;
}

/**
 * Every type of column component should build on this
 */
@Directive({
    standalone: true
})
export abstract class UITableViewColumn {
    public headerText = input<string>('');

    /**
     * Represents the property in the row object that represents this column
     */
    public key = input.required<string>();

    public sortable = input<boolean>(false);

    public abstract readonly cellTemplate: TemplateRef<UITableViewCellContext>;

    protected getValue(row: unknown): unknown {
        return (row as Record<string, unknown>)[this.key()];
    }
}