import { TestBed } from "@angular/core/testing";
import { StorageService } from "@theredhead/lucid-foundation";
import { ColumnResizeService } from "./column-resize.service";

describe("ColumnResizeService", () => {
  let service: ColumnResizeService;
  let storageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    storageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ColumnResizeService,
        { provide: StorageService, useValue: storageMock },
      ],
    });
    service = TestBed.inject(ColumnResizeService);
  });

  describe("load", () => {
    it("should return empty map for empty tableId", () => {
      const map = service.load("");
      expect(map.size).toBe(0);
      expect(storageMock.getItem).not.toHaveBeenCalled();
    });

    it("should return empty map when storage has no data", () => {
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(null);
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should parse valid stored entries", () => {
      const entries = [
        { key: "name", widthPx: 200 },
        { key: "age", widthPx: 100 },
      ];
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(JSON.stringify(entries));
      const map = service.load("table-1");
      expect(map.get("name")).toBe(200);
      expect(map.get("age")).toBe(100);
    });

    it("should skip entries with invalid key type", () => {
      const entries = [{ key: 123, widthPx: 200 }];
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(JSON.stringify(entries));
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should skip entries with non-number widthPx", () => {
      const entries = [{ key: "name", widthPx: "wide" }];
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(JSON.stringify(entries));
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should skip entries with widthPx <= 0", () => {
      const entries = [
        { key: "name", widthPx: 0 },
        { key: "age", widthPx: -10 },
      ];
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(JSON.stringify(entries));
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should handle corrupt JSON gracefully", () => {
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue("{not-valid-json");
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should handle storage throwing", () => {
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(() => {
        throw new Error("localStorage gone");
      });
      const map = service.load("table-1");
      expect(map.size).toBe(0);
    });

    it("should use correct storage key prefix", () => {
      (
        storageMock.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(null);
      service.load("my-table");
      expect(storageMock.getItem).toHaveBeenCalledWith(
        "ui-table-col-widths:my-table",
      );
    });
  });

  describe("save", () => {
    it("should not call storage for empty tableId", () => {
      service.save("", new Map([["name", 200]]));
      expect(storageMock.setItem).not.toHaveBeenCalled();
    });

    it("should serialize widths map to JSON", () => {
      const widths = new Map([
        ["name", 200],
        ["age", 100],
      ]);
      service.save("table-1", widths);
      expect(storageMock.setItem).toHaveBeenCalledWith(
        "ui-table-col-widths:table-1",
        expect.any(String),
      );
      const stored = JSON.parse(
        (storageMock.setItem as unknown as ReturnType<typeof vi.fn>).mock
          .calls[0][1],
      );
      expect(stored).toEqual(
        expect.arrayContaining([
          { key: "name", widthPx: 200 },
          { key: "age", widthPx: 100 },
        ]),
      );
    });

    it("should handle storage throwing gracefully", () => {
      (
        storageMock.setItem as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      expect(() => service.save("t", new Map([["a", 1]]))).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should not call storage for empty tableId", () => {
      service.clear("");
      expect(storageMock.removeItem).not.toHaveBeenCalled();
    });

    it("should call removeItem with correct key", () => {
      service.clear("table-1");
      expect(storageMock.removeItem).toHaveBeenCalledWith(
        "ui-table-col-widths:table-1",
      );
    });

    it("should handle storage throwing gracefully", () => {
      (
        storageMock.removeItem as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(() => {
        throw new Error("boom");
      });
      expect(() => service.clear("table-1")).not.toThrow();
    });
  });
});
