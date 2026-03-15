import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UITextColumn } from "./text-column.component";
import { UITableViewColumn } from "../table-column.directive";

describe("UITextColumn", () => {
  let fixture: ComponentFixture<UITextColumn>;
  let component: UITextColumn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UITextColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(UITextColumn);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("key", "name");
    fixture.componentRef.setInput("headerText", "Name");
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
      expect(component.key()).toBe("name");
    });

    it("should have the correct headerText", () => {
      expect(component.headerText()).toBe("Name");
    });

    it("should default truncate to false", () => {
      expect(component.truncate()).toBe(false);
    });

    it("should accept truncate input", () => {
      fixture.componentRef.setInput("truncate", true);
      fixture.detectChanges();
      expect(component.truncate()).toBe(true);
    });
  });

  describe("cellTemplate", () => {
    it("should have a cellTemplate", () => {
      expect(component.cellTemplate).toBeTruthy();
    });
  });

  describe("getValue", () => {
    it("should extract the property value from a row", () => {
      const col = component as any;
      const row = { name: "Alice", age: 30 };
      expect(col.getCellValue(row)).toBe("Alice");
    });

    it("should return undefined for missing properties", () => {
      const col = component as any;
      const row = { age: 30 };
      expect(col.getCellValue(row)).toBeUndefined();
    });
  });

  describe("stringValue", () => {
    it("should convert the value to a string", () => {
      const col = component as any;
      expect(col.stringValue({ name: "Alice" })).toBe("Alice");
    });

    it("should convert null/undefined to empty string", () => {
      const col = component as any;
      expect(col.stringValue({ name: null })).toBe("");
      expect(col.stringValue({ name: undefined })).toBe("");
      expect(col.stringValue({})).toBe("");
    });

    it("should convert numbers to string", () => {
      const col = component as any;
      expect(col.stringValue({ name: 42 })).toBe("42");
    });
  });
});
