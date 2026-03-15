import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UINumberColumn } from "./number-column.component";
import { UITableViewColumn } from "../table-column.directive";

describe("UINumberColumn", () => {
  let fixture: ComponentFixture<UINumberColumn>;
  let component: UINumberColumn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UINumberColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(UINumberColumn);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("key", "amount");
    fixture.componentRef.setInput("headerText", "Amount");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("DI forwarding", () => {
    it("should be injectable as UITableViewColumn", () => {
      expect(component instanceof UITableViewColumn).toBe(true);
    });
  });

  describe("inputs", () => {
    it("should have the correct key", () => {
      expect(component.key()).toBe("amount");
    });

    it("should have the correct headerText", () => {
      expect(component.headerText()).toBe("Amount");
    });

    it("should default format to empty object", () => {
      expect(component.format()).toEqual({});
    });

    it("should default locale to undefined", () => {
      expect(component.locale()).toBeUndefined();
    });

    it("should default fallback to empty string", () => {
      expect(component.fallback()).toBe("");
    });
  });

  describe("cellTemplate", () => {
    it("should have a cellTemplate", () => {
      expect(component.cellTemplate).toBeTruthy();
    });
  });

  describe("formattedValue", () => {
    it("should format a numeric value", () => {
      const col = component as any;
      const result = col.formattedValue({ amount: 1234.56 });
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should format with currency options", () => {
      fixture.componentRef.setInput("format", {
        style: "currency",
        currency: "USD",
      });
      fixture.componentRef.setInput("locale", "en-US");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: 1234.56 })).toBe("$1,234.56");
    });

    it("should format with percent style", () => {
      fixture.componentRef.setInput("format", { style: "percent" });
      fixture.componentRef.setInput("locale", "en-US");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: 0.42 })).toBe("42%");
    });

    it("should convert string numbers to numeric", () => {
      fixture.componentRef.setInput("locale", "en-US");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: "1234" })).toBe("1,234");
    });

    it("should return fallback for null values", () => {
      fixture.componentRef.setInput("fallback", "N/A");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: null })).toBe("N/A");
    });

    it("should return fallback for undefined values", () => {
      fixture.componentRef.setInput("fallback", "—");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: undefined })).toBe("—");
    });

    it("should return fallback for empty string values", () => {
      fixture.componentRef.setInput("fallback", "N/A");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: "" })).toBe("N/A");
    });

    it("should return fallback for NaN values (from non-numeric strings)", () => {
      fixture.componentRef.setInput("fallback", "—");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: "not-a-number" })).toBe("—");
    });

    it("should return original string when NaN and no fallback", () => {
      const col = component as any;
      expect(col.formattedValue({ amount: "abc" })).toBe("abc");
    });

    it("should handle zero correctly (not treated as falsy)", () => {
      fixture.componentRef.setInput("locale", "en-US");
      fixture.detectChanges();

      const col = component as any;
      expect(col.formattedValue({ amount: 0 })).toBe("0");
    });

    it("should handle negative numbers", () => {
      fixture.componentRef.setInput("locale", "en-US");
      fixture.detectChanges();

      const col = component as any;
      const result = col.formattedValue({ amount: -42.5 });
      expect(result).toContain("42.5");
    });

    it("should respect locale for formatting", () => {
      fixture.componentRef.setInput("locale", "de-DE");
      fixture.detectChanges();

      const col = component as any;
      const result = col.formattedValue({ amount: 1234.56 });
      expect(result).toContain("1.234,56");
    });
  });
});
