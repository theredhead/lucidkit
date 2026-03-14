import {
    IDatasource,
    RowResult,
} from './datasource';

export class ArrayDatasource<T> implements IDatasource<T> {
    private readonly rows: T[];

    constructor(data: T[]) {
        // Make sure we own a fresh copy so callers cannot mutate table data order/size externally.
        this.rows = [...data];
    }

    getNumberOfItems(): number | Promise<number> {
        return this.rows.length;
    }

    getObjectAtRowIndex(rowIndex: number): RowResult<T> {
        if (rowIndex < 0 || rowIndex > this.rows.length - 1) {
            throw new RangeError('rowIndex must be greater than or equal to 0 and smaller than the size of the collection');
        }

        return this.rows[rowIndex];
    }
}
