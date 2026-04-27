import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopoverRef } from "@theredhead/lucid-kit";
import {
  UITemplateBlockDialog,
  type TemplateBlockDialogResult,
} from "./template-block-dialog.component";

describe("UITemplateBlockDialog", () => {
  let fixture: ComponentFixture<UITemplateBlockDialog>;
  let component: UITemplateBlockDialog;
  let popoverRef: PopoverRef<TemplateBlockDialogResult>;

  beforeEach(async () => {
    popoverRef = new PopoverRef<TemplateBlockDialogResult>();

    await TestBed.configureTestingModule({
      imports: [UITemplateBlockDialog],
      providers: [{ provide: PopoverRef, useValue: popoverRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(UITemplateBlockDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render provider-defined attributes as property rows", async () => {
    fixture.componentRef.setInput("blockName", "if");
    fixture.componentRef.setInput("blockLabel", "If");
    fixture.componentRef.setInput("initialAttributes", { test: "isPremium" });
    fixture.componentRef.setInput("attributeDefinitions", [
      {
        key: "test",
        label: "Condition",
        type: "string",
        required: true,
        placeholder: "isPremium",
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(".ps-label");
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("ui-input input");
    const textarea = fixture.nativeElement.querySelector("textarea");

    expect(label.textContent).toContain("Condition");
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe("isPremium");
    expect(input.value).toBe("isPremium");
    expect(textarea).toBeNull();
  });

  it("should close with only the property-sheet attributes on apply", async () => {
    const closeSpy = vi.spyOn(popoverRef, "close");
    fixture.componentRef.setInput("blockName", "loop");
    fixture.componentRef.setInput("initialAttributes", { items: "lines" });
    fixture.componentRef.setInput("attributeDefinitions", [
      {
        key: "items",
        label: "Items",
        type: "string",
        required: true,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("ui-input input");
    input.value = " invoice.lines ";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const apply: HTMLButtonElement =
      fixture.nativeElement.querySelector(".btn.apply");
    apply.click();

    expect(closeSpy).toHaveBeenCalledWith({
      name: "loop",
      attributes: { items: "invoice.lines" },
    });
  });

  it("should fall back to generated property rows for existing attributes", async () => {
    fixture.componentRef.setInput("initialAttributes", {
      "data-source": "customer",
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(".ps-label");
    const input = fixture.nativeElement.querySelector("ui-input input");

    expect(label.textContent).toContain("Data Source");
    expect(input).toBeTruthy();
  });
});
