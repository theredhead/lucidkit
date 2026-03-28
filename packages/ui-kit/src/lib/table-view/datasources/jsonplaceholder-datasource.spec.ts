import {
  JsonPlaceholderDatasource,
  JsonPlaceholderPostsDatasource,
  JsonPlaceholderCommentsDatasource,
  JsonPlaceholderPhotosDatasource,
} from "./jsonplaceholder-datasource";

function createMockFetch(
  items: unknown[],
  totalCount?: number,
): typeof fetch {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    const params = new URL(url).searchParams;
    const page = parseInt(params.get("_page") ?? "1", 10);
    const limit = parseInt(params.get("_limit") ?? "100", 10);
    const start = (page - 1) * limit;
    const slice = items.slice(start, start + limit);

    const headers = new Headers();
    if (totalCount !== undefined) {
      headers.set("x-total-count", String(totalCount));
    }

    return {
      ok: true,
      status: 200,
      headers,
      json: async () => slice,
    } as Response;
  });
}

function createFailingFetch(status = 500): typeof fetch {
  return vi.fn(async () => ({
    ok: false,
    status,
    headers: new Headers(),
    json: async () => ({}),
  })) as unknown as typeof fetch;
}

describe("JsonPlaceholderDatasource", () => {
  describe("constructor", () => {
    it("should create with default pageSize", () => {
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch([]));
      expect(ds).toBeTruthy();
    });

    it("should throw RangeError for pageSize <= 0", () => {
      expect(() => new JsonPlaceholderDatasource("posts", 0, createMockFetch([]))).toThrow(
        RangeError,
      );
      expect(() => new JsonPlaceholderDatasource("posts", -1, createMockFetch([]))).toThrow(
        RangeError,
      );
    });
  });

  describe("getNumberOfItems", () => {
    it("should return total from x-total-count header", async () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch(items, 50));
      const count = await ds.getNumberOfItems();
      expect(count).toBe(50);
    });

    it("should return cached total on second call", async () => {
      const mockFetch = createMockFetch([{ id: 1 }], 10);
      const ds = new JsonPlaceholderDatasource("posts", 10, mockFetch);
      await ds.getNumberOfItems();
      const count = ds.getNumberOfItems();
      // Second call returns a number directly (synchronous)
      expect(count).toBe(10);
    });

    it("should fallback to page items length when no header", async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch(items));
      const count = await ds.getNumberOfItems();
      // items.length < pageSize so total = 0 * 10 + 2 = 2
      expect(count).toBe(2);
    });
  });

  describe("getObjectAtRowIndex", () => {
    it("should return cached item synchronously", async () => {
      const items = [{ id: 0 }, { id: 1 }, { id: 2 }];
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch(items, 3));
      // Load the page first
      await ds.getNumberOfItems();
      const row = ds.getObjectAtRowIndex(1);
      expect(row).toEqual({ id: 1 });
    });

    it("should fetch page and return item asynchronously", async () => {
      const items = [{ id: 0 }, { id: 1 }];
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch(items, 2));
      const row = await ds.getObjectAtRowIndex(0);
      expect(row).toEqual({ id: 0 });
    });

    it("should throw RangeError for negative rowIndex", () => {
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch([]));
      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw RangeError for rowIndex out of bounds (known total)", async () => {
      const ds = new JsonPlaceholderDatasource("posts", 10, createMockFetch([{ id: 0 }], 1));
      await ds.getNumberOfItems();
      expect(() => ds.getObjectAtRowIndex(5)).toThrow(RangeError);
    });

    it("should throw when row is undefined in fetched page", async () => {
      // 2 items in page but total says 10 — asking for index 5 will have empty page
      const items = [{ id: 0 }, { id: 1 }];
      const ds = new JsonPlaceholderDatasource("posts", 3, createMockFetch(items, 10));
      await expect(ds.getObjectAtRowIndex(5)).rejects.toThrow(RangeError);
    });

    it("should handle pagination correctly", async () => {
      const items = Array.from({ length: 15 }, (_, i) => ({ id: i }));
      const ds = new JsonPlaceholderDatasource("posts", 5, createMockFetch(items, 15));
      const row = await ds.getObjectAtRowIndex(7);
      expect(row).toEqual({ id: 7 });
    });
  });

  describe("error handling", () => {
    it("should throw on HTTP error", async () => {
      const ds = new JsonPlaceholderDatasource("posts", 10, createFailingFetch(404));
      await expect(ds.getNumberOfItems()).rejects.toThrow("Failed to load");
    });

    it("should clean up in-flight page on error", async () => {
      const ds = new JsonPlaceholderDatasource("posts", 10, createFailingFetch());
      try {
        await ds.getNumberOfItems();
      } catch {
        // expected
      }
      // Try again — should not return stale in-flight promise
      await expect(ds.getNumberOfItems()).rejects.toThrow();
    });
  });

  describe("in-flight deduplication", () => {
    it("should not fetch the same page twice concurrently", async () => {
      const items = [{ id: 0 }];
      const mockFetch = createMockFetch(items, 1);
      const ds = new JsonPlaceholderDatasource("posts", 10, mockFetch);
      const [a, b] = await Promise.all([
        ds.getNumberOfItems(),
        ds.getNumberOfItems(),
      ]);
      expect(a).toBe(1);
      expect(b).toBe(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("URL construction", () => {
    it("should use correct resource and pagination params", async () => {
      const mockFetch = createMockFetch([{ id: 0 }], 1);
      const ds = new JsonPlaceholderDatasource("comments", 25, mockFetch);
      await ds.getNumberOfItems();
      const calledUrl = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain("/comments?");
      expect(calledUrl).toContain("_page=1");
      expect(calledUrl).toContain("_limit=25");
    });
  });
});

describe("JsonPlaceholderPostsDatasource", () => {
  it("should create with posts resource", async () => {
    const ds = new JsonPlaceholderPostsDatasource(10, createMockFetch([], 0));
    expect(await ds.getNumberOfItems()).toBe(0);
  });
});

describe("JsonPlaceholderCommentsDatasource", () => {
  it("should create with comments resource", async () => {
    const ds = new JsonPlaceholderCommentsDatasource(10, createMockFetch([], 0));
    expect(await ds.getNumberOfItems()).toBe(0);
  });
});

describe("JsonPlaceholderPhotosDatasource", () => {
  it("should create with photos resource", async () => {
    const ds = new JsonPlaceholderPhotosDatasource(10, createMockFetch([], 0));
    expect(await ds.getNumberOfItems()).toBe(0);
  });
});
