import { InjectionToken } from '@angular/core';

/**
 * PageSize for tables where it is not customized
 */
export const DEFAULT_PAGE_SIZE = new InjectionToken<number>('DEFAULT_PAGE_SIZE', {
    providedIn: 'root',
    factory: () => 100,
});

/**
 * Represents a single row that may or may not be immediately available.
 */
export type RowResult<T> = T | Promise<T>;

export interface IDatasource<T = any> {
    getNumberOfItems(): number | Promise<number>;
    getObjectAtRowIndex(rowIndex: number): RowResult<T>
}

export interface RangeDefinition {
    start: number;
    length: number;
}