import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIBadgeColumn } from "./badge-column.component";
import { UITableViewColumn } from "../table-column.directive";

describe("UIBadgeColumn", () => {
  let fixture: ComponentFixture<UIBadgeColumn>;
  let component: UIBadgeColumn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIBadgeColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(UIBadgeColumn);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("key", "status");
    fixture.componentRef.setInput("headerText", "Status");
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
      expect(component.key()).toBe("status");
    });

    it("should have the correct headerText", () => {
      expect(component.headerText()).toBe("Status");
    });

    it("should default variant to 'neutral'", () => {
      expect(component.variant()).toBe("neutral");
    });

    const variants = ["neutral", "success", "warning", "danger"] as const;

    for (const variant of variants) {
      it(`should accept variant '${variant}'`, () => {
        fixture.componentRef.setInput("variant", variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    }
  });

  describe("cellTemplate", () => {
    it("should have a cellTemplate", () => {
      expect(component.cellTemplate).toBeTruthy();
    });
  });

  describe("getValue", () => {
    it("should extract the property value from a row", () => {
      const col = component as any;
      const row = { status: "active", name: "Alice" };
      expect(col.getCellValue(row)).toBe("active");
    });
  });
});
