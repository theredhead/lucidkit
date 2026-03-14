import { IDatasource, RowResult } from "./datasource";

import { INITIAL_PAGE_SIZE } from "../table-view.constants";

type RestPayload<T> = {
  rows: T[];
  totalNumberOfRows: number;
};

const defaultFetch: typeof fetch = (input, init) =>
  globalThis.fetch(input, init);

/**
 * Very small lazy REST datasource.
 *
 * It requests pages from:
 * `${baseUrl}?pageIndex=<n>&pageSize=<size>`
 * and caches each page in memory after the first request.
 */
export class RestDatasource<T> implements IDatasource<T> {
  private readonly pageCache = new Map<number, T[]>();
  private readonly inFlightPages = new Map<number, Promise<T[]>>();
  private totalItems: number | undefined;

  constructor(
    private readonly baseUrl: string,
    private readonly pageSize: number = INITIAL_PAGE_SIZE,
    private readonly fetchFn: typeof fetch = defaultFetch,
  ) {
    if (pageSize <= 0) {
      throw new RangeError("pageSize must be greater than 0");
    }
  }

  getNumberOfItems(): number | Promise<number> {
    if (this.totalItems !== undefined) {
      return this.totalItems;
    }

    // Prime metadata from the first page when total is not known yet.
    return this.ensurePageLoaded(0).then(() => this.totalItems ?? 0);
  }

  getObjectAtRowIndex(rowIndex: number): RowResult<T> {
    if (rowIndex < 0) {
      throw new RangeError("rowIndex must be greater than or equal to 0");
    }

    if (this.totalItems !== undefined && rowIndex >= this.totalItems) {
      throw new RangeError("rowIndex is outside the datasource bounds");
    }

    const pageIndex = Math.floor(rowIndex / this.pageSize);
    const indexInPage = rowIndex % this.pageSize;
    const cachedPage = this.pageCache.get(pageIndex);

    if (cachedPage) {
      const row = cachedPage[indexInPage];
      if (row === undefined) {
        throw new RangeError("rowIndex is outside the datasource bounds");
      }
      return row;
    }

    return this.ensurePageLoaded(pageIndex).then((page) => {
      const row = page[indexInPage];
      if (row === undefined) {
        throw new RangeError("rowIndex is outside the datasource bounds");
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
    const separator = this.baseUrl.includes("?") ? "&" : "?";
    const url = `${this.baseUrl}${separator}pageIndex=${pageIndex}&pageSize=${this.pageSize}`;

    const response = await this.fetchFn(url);
    if (!response.ok) {
      throw new Error(
        `Failed to load page ${pageIndex} (HTTP ${response.status})`,
      );
    }

    const payload = (await response.json()) as RestPayload<T>;
    const items = this.extractItems(payload);
    this.trySetTotalItems(payload, pageIndex, items.length);

    return items;
  }

  private extractItems(payload: RestPayload<T>): T[] {
    if (Array.isArray(payload.rows)) {
      return payload.rows;
    }

    throw new Error("REST response must include a rows array");
  }

  private trySetTotalItems(
    payload: RestPayload<T>,
    pageIndex: number,
    itemCount: number,
  ): void {
    if (typeof payload.totalNumberOfRows === "number") {
      this.totalItems = payload.totalNumberOfRows;
      return;
    }

    // If the page is shorter than pageSize, infer total from this terminal page.
    if (itemCount < this.pageSize) {
      this.totalItems = pageIndex * this.pageSize + itemCount;
    }
  }
}
