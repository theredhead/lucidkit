import {
    IDatasource,
    RowResult,
} from './datasource';

const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';
const defaultFetch: typeof fetch = (input, init) => globalThis.fetch(input, init);

export interface JsonPlaceholderPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface JsonPlaceholderComment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

export interface JsonPlaceholderPhoto {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

/**
 * Lazy page-cached datasource for JSONPlaceholder resources.
 *
 * Storybook/demo utility only. Not intended for production application data access.
 * Uses `_page` (1-based) and `_limit`; total rows are read from `x-total-count` header.
 */
export class JsonPlaceholderDatasource<T> implements IDatasource<T> {
    private readonly pageCache = new Map<number, T[]>();
    private readonly inFlightPages = new Map<number, Promise<T[]>>();
    private totalItems: number | undefined;

    constructor(
        private readonly resource: 'posts' | 'comments' | 'photos',
        private readonly pageSize: number = 100,
        private readonly fetchFn: typeof fetch = defaultFetch,
    ) {
        if (pageSize <= 0) {
            throw new RangeError('pageSize must be greater than 0');
        }
    }

    getNumberOfItems(): number | Promise<number> {
        if (this.totalItems !== undefined) {
            return this.totalItems;
        }

        return this.ensurePageLoaded(0).then(() => this.totalItems ?? 0);
    }

    getObjectAtRowIndex(rowIndex: number): RowResult<T> {
        if (rowIndex < 0) {
            throw new RangeError('rowIndex must be greater than or equal to 0');
        }

        if (this.totalItems !== undefined && rowIndex >= this.totalItems) {
            throw new RangeError('rowIndex is outside the datasource bounds');
        }

        const pageIndex = Math.floor(rowIndex / this.pageSize);
        const indexInPage = rowIndex % this.pageSize;
        const cachedPage = this.pageCache.get(pageIndex);

        if (cachedPage) {
            const row = cachedPage[indexInPage];
            if (row === undefined) {
                throw new RangeError('rowIndex is outside the datasource bounds');
            }
            return row;
        }

        return this.ensurePageLoaded(pageIndex).then((page) => {
            const row = page[indexInPage];
            if (row === undefined) {
                throw new RangeError('rowIndex is outside the datasource bounds');
            }
            return row;
        });
    }

    private ensurePageLoaded(pageIndex: number): Promise<T[]> {
        const cached = this.pageCache.get(pageIndex);
        if (cached) {
            return Promise.resolve(cached);
        }

        const inFlight = this.inFlightPages.get(pageIndex);
        if (inFlight) {
            return inFlight;
        }

        const loadPromise = this.fetchPage(pageIndex)
            .then((page) => {
                this.pageCache.set(pageIndex, page);
                this.inFlightPages.delete(pageIndex);
                return page;
            })
            .catch((error) => {
                this.inFlightPages.delete(pageIndex);
                throw error;
            });

        this.inFlightPages.set(pageIndex, loadPromise);
        return loadPromise;
    }

    private async fetchPage(pageIndex: number): Promise<T[]> {
        const page = pageIndex + 1;
        const url = `${JSONPLACEHOLDER_BASE_URL}/${this.resource}?_page=${page}&_limit=${this.pageSize}`;

        const response = await this.fetchFn(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${this.resource} page ${pageIndex} (HTTP ${response.status})`);
        }

        const headerTotal = response.headers.get('x-total-count');
        if (headerTotal !== null) {
            const parsed = Number.parseInt(headerTotal, 10);
            if (!Number.isNaN(parsed)) {
                this.totalItems = parsed;
            }
        }

        const rows = (await response.json()) as T[];

        // Fallback when the total count header is unavailable.
        if (this.totalItems === undefined && rows.length < this.pageSize) {
            this.totalItems = pageIndex * this.pageSize + rows.length;
        }

        return rows;
    }
}

export class JsonPlaceholderPostsDatasource extends JsonPlaceholderDatasource<JsonPlaceholderPost> {
    constructor(pageSize: number = 100, fetchFn: typeof fetch = defaultFetch) {
        super('posts', pageSize, fetchFn);
    }
}

export class JsonPlaceholderCommentsDatasource extends JsonPlaceholderDatasource<JsonPlaceholderComment> {
    constructor(pageSize: number = 100, fetchFn: typeof fetch = defaultFetch) {
        super('comments', pageSize, fetchFn);
    }
}

export class JsonPlaceholderPhotosDatasource extends JsonPlaceholderDatasource<JsonPlaceholderPhoto> {
    constructor(pageSize: number = 100, fetchFn: typeof fetch = defaultFetch) {
        super('photos', pageSize, fetchFn);
    }
}
