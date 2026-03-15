import { RestDatasource } from "./rest-datasource";

/**
 * Creates a mock fetch function that returns the given payload.
 */
function mockFetch(
  payload: { rows: unknown[]; totalNumberOfRows: number },
  status = 200,
): typeof fetch {
  return () =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(payload),
    } as Response);
}

/**
 * Creates a mock fetch that returns different pages based on the URL.
 */
function mockPagedFetch(
  pages: Record<number, unknown[]>,
  totalNumberOfRows: number,
): typeof fetch {
  return (input: RequestInfo | URL) => {
    const url = String(input);
    const match = url.match(/pageIndex=(\d+)/);
    const pageIndex = match ? Number(match[1]) : 0;
    const rows = pages[pageIndex] ?? [];

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ rows, totalNumberOfRows }),
    } as Response);
  };
}

describe("RestDatasource", () => {
  describe("constructor", () => {
    it("should create an instance", () => {
      const ds = new RestDatasource("https://api.example.com/items");
      expect(ds).toBeTruthy();
    });

    it("should throw RangeError for zero pageSize", () => {
      expect(() => new RestDatasource("https://api.example.com", 0)).toThrow(
        RangeError,
      );
    });

    it("should throw RangeError for negative pageSize", () => {
      expect(() => new RestDatasource("https://api.example.com", -1)).toThrow(
        RangeError,
      );
    });
  });

  describe("getNumberOfItems", () => {
    it("should return total from the first page fetch", async () => {
      const fetchFn = mockFetch({
        rows: [{ id: 1 }],
        totalNumberOfRows: 100,
      });
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      const count = await ds.getNumberOfItems();
      expect(count).toBe(100);
    });

    it("should return synchronously after first fetch", async () => {
      const fetchFn = mockFetch({
        rows: [{ id: 1 }],
        totalNumberOfRows: 50,
      });
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      // Prime the cache
      await ds.getNumberOfItems();

      // Now should return synchronously
      const count = ds.getNumberOfItems();
      expect(count).toBe(50);
    });
  });

  describe("getObjectAtRowIndex", () => {
    it("should return a row from the first page", async () => {
      const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const fetchFn = mockFetch({ rows, totalNumberOfRows: 3 });
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      const row = await ds.getObjectAtRowIndex(0);
      expect(row).toEqual({ id: 1 });

      const row2 = await ds.getObjectAtRowIndex(2);
      expect(row2).toEqual({ id: 3 });
    });

    it("should return from cache on repeated access", async () => {
      let fetchCount = 0;
      const rows = [{ id: 1 }, { id: 2 }];
      const fetchFn: typeof fetch = () => {
        fetchCount++;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ rows, totalNumberOfRows: 2 }),
        } as Response);
      };
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      await ds.getObjectAtRowIndex(0);
      await ds.getObjectAtRowIndex(1);

      // Both are on page 0, so only one fetch should have occurred
      expect(fetchCount).toBe(1);
    });

    it("should fetch different pages as needed", async () => {
      const page0 = [{ id: 1 }, { id: 2 }];
      const page1 = [{ id: 3 }, { id: 4 }];
      const fetchFn = mockPagedFetch({ 0: page0, 1: page1 }, 4);
      const ds = new RestDatasource(
        "https://api.example.com/items",
        2,
        fetchFn,
      );

      const row0 = await ds.getObjectAtRowIndex(0);
      expect(row0).toEqual({ id: 1 });

      const row2 = await ds.getObjectAtRowIndex(2);
      expect(row2).toEqual({ id: 3 });
    });

    it("should throw RangeError for negative index", () => {
      const fetchFn = mockFetch({ rows: [], totalNumberOfRows: 0 });
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw RangeError for index beyond bounds (when total is known)", async () => {
      const fetchFn = mockFetch({
        rows: [{ id: 1 }],
        totalNumberOfRows: 1,
      });
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      // Prime totalItems
      await ds.getNumberOfItems();

      expect(() => ds.getObjectAtRowIndex(1)).toThrow(RangeError);
    });
  });

  describe("URL construction", () => {
    it("should append query parameters with ? separator", async () => {
      let capturedUrl = "";
      const fetchFn: typeof fetch = (input) => {
        capturedUrl = String(input);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ rows: [{ id: 1 }], totalNumberOfRows: 1 }),
        } as Response);
      };
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      await ds.getObjectAtRowIndex(0);

      expect(capturedUrl).toBe(
        "https://api.example.com/items?pageIndex=0&pageSize=10",
      );
    });

    it("should use & separator when URL already has query params", async () => {
      let capturedUrl = "";
      const fetchFn: typeof fetch = (input) => {
        capturedUrl = String(input);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ rows: [{ id: 1 }], totalNumberOfRows: 1 }),
        } as Response);
      };
      const ds = new RestDatasource(
        "https://api.example.com/items?filter=active",
        10,
        fetchFn,
      );

      await ds.getObjectAtRowIndex(0);

      expect(capturedUrl).toBe(
        "https://api.example.com/items?filter=active&pageIndex=0&pageSize=10",
      );
    });
  });

  describe("error handling", () => {
    it("should throw on non-OK HTTP response", async () => {
      const fetchFn = mockFetch({ rows: [], totalNumberOfRows: 0 }, 500);
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      await expect(ds.getObjectAtRowIndex(0)).rejects.toThrow(
        /Failed to load page.*HTTP 500/,
      );
    });

    it("should throw when response has no rows array", async () => {
      const fetchFn: typeof fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: [] }),
        } as Response);
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      await expect(ds.getObjectAtRowIndex(0)).rejects.toThrow(
        "REST response must include a rows array",
      );
    });

    it("should clean up in-flight tracking on fetch error", async () => {
      let callCount = 0;
      const fetchFn: typeof fetch = () => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error("network error"));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ rows: [{ id: 1 }], totalNumberOfRows: 1 }),
        } as Response);
      };
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      // First call fails
      await expect(ds.getObjectAtRowIndex(0)).rejects.toThrow("network error");

      // Retry should work (in-flight was cleaned up)
      const row = await ds.getObjectAtRowIndex(0);
      expect(row).toEqual({ id: 1 });
    });
  });

  describe("total items inference", () => {
    it("should infer total from short page when totalNumberOfRows is missing", async () => {
      const fetchFn: typeof fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ rows: [{ id: 1 }, { id: 2 }] }),
        } as Response);
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      // Page has 2 items but pageSize is 10 → short page, so total = 0*10 + 2 = 2
      const count = await ds.getNumberOfItems();
      expect(count).toBe(2);
    });
  });

  describe("concurrent requests", () => {
    it("should deduplicate in-flight requests for the same page", async () => {
      let fetchCount = 0;
      const fetchFn: typeof fetch = () => {
        fetchCount++;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              rows: [{ id: 1 }, { id: 2 }],
              totalNumberOfRows: 2,
            }),
        } as Response);
      };
      const ds = new RestDatasource(
        "https://api.example.com/items",
        10,
        fetchFn,
      );

      // Fire two concurrent requests for the same page
      const [row0, row1] = await Promise.all([
        ds.getObjectAtRowIndex(0),
        ds.getObjectAtRowIndex(1),
      ]);

      expect(row0).toEqual({ id: 1 });
      expect(row1).toEqual({ id: 2 });
      expect(fetchCount).toBe(1);
    });
  });
});
