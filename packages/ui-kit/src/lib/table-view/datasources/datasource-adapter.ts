import {
    computed,
    signal,
    WritableSignal,
} from '@angular/core';

import {
    IDatasource,
    RangeDefinition,
    RowResult,
} from './datasource';

export class DatasourceAdapter<T> {
    readonly pageIndex: WritableSignal<number> = signal<number>(0);
    readonly pageSize: WritableSignal<number>;
    readonly totalItems = signal<number | null>(null);
    readonly visibleRange = computed(() => {
        const index = this.pageIndex();
        const length = this.pageSize();
        const start = index * length;
        return { start, length };
    });
    readonly visibleWindow = computed(() => this.getItemsInRange(this.visibleRange()));

    constructor(
        private datasource: IDatasource<T>,
        initialPageSize: number = 100,
    ) {
        if (!Number.isFinite(initialPageSize) || initialPageSize <= 0) {
            throw new RangeError('initialPageSize must be a positive number');
        }

        this.pageSize = signal<number>(initialPageSize);
        Promise.resolve(datasource.getNumberOfItems()).then(n => this.totalItems.set(n));
    }

    private getItemsInRange(range: RangeDefinition): RowResult<T>[] {
        const result: RowResult<T>[] = [];
        for (let rowIndex = range.start; rowIndex < range.start + range.length; rowIndex++) {
            result.push(this.datasource.getObjectAtRowIndex(rowIndex));
        }
        return result;
    }
}
