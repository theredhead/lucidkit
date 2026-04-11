import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import {
  UIDropdownDivider,
  UIDropdownItem,
  UIDropdownMenu,
} from "./dropdown-menu.component";

@Component({
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider],
  template: `
    <ui-dropdown-menu>
      <button trigger>Open</button>
      <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item [disabled]="true">Disabled</ui-dropdown-item>
      <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
class TestHostComponent {
  public editCalled = false;
  public deleteCalled = false;

  public onEdit(): void {
    this.editCalled = true;
  }

  public onDelete(): void {
    this.deleteCalled = true;
  }
}

describe("UIDropdownMenu", () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    const menu = fixture.nativeElement.querySelector("ui-dropdown-menu");
    expect(menu).toBeTruthy();
  });

  describe("closed state", () => {
    it("should not render menu panel", () => {
      const panel = fixture.nativeElement.querySelector(".panel");
      expect(panel).toBeFalsy();
    });

    it("should render trigger", () => {
      const trigger = fixture.nativeElement.querySelector(".trigger");
      expect(trigger).toBeTruthy();
    });
  });

  describe("open state", () => {
    beforeEach(() => {
      const trigger = fixture.nativeElement.querySelector(
        ".trigger",
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();
    });

    it("should render menu panel on trigger click", () => {
      const panel = fixture.nativeElement.querySelector(".panel");
      expect(panel).toBeTruthy();
    });

    it("should render menu items", () => {
      const items = fixture.nativeElement.querySelectorAll("ui-dropdown-item");
      expect(items.length).toBe(3);
    });

    it("should render divider", () => {
      const divider = fixture.nativeElement.querySelector(
        "ui-dropdown-divider",
      );
      expect(divider).toBeTruthy();
    });

    it("should toggle menu on second click", () => {
      const trigger = fixture.nativeElement.querySelector(
        ".trigger",
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(".panel");
      expect(panel).toBeFalsy();
    });
  });

  describe("item interaction", () => {
    beforeEach(() => {
      const trigger = fixture.nativeElement.querySelector(
        ".trigger",
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();
    });

    it("should close menu when item is clicked", () => {
      const items = fixture.nativeElement.querySelectorAll(
        "ui-dropdown-item",
      ) as NodeListOf<HTMLElement>;
      items[0].click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(".panel");
      expect(panel).toBeFalsy();
    });
  });

  describe("close on Escape", () => {
    it("should close when Escape is pressed", () => {
      const trigger = fixture.nativeElement.querySelector(
        ".trigger",
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(".panel");
      expect(panel).toBeFalsy();
    });
  });
});

describe("UIDropdownItem", () => {
  let component: UIDropdownItem;
  let fixture: ComponentFixture<UIDropdownItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDropdownItem],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDropdownItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should default disabled to false", () => {
    expect(component.disabled()).toBe(false);
  });

  it("should apply disabled host class", () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain(
      "disabled",
    );
  });

  it('should have role="menuitem"', () => {
    expect(fixture.nativeElement.getAttribute("role")).toBe("menuitem");
  });

  it("should emit action on click", () => {
    const spy = vi.fn();
    component.action.subscribe(spy);
    component.onClick();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not emit action when disabled", () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.action.subscribe(spy);
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should set tabindex -1 when disabled", () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute("tabindex")).toBe("-1");
  });

  it("should set tabindex 0 when enabled", () => {
    expect(fixture.nativeElement.getAttribute("tabindex")).toBe("0");
  });
});

describe("UIDropdownDivider", () => {
  it("should create", async () => {
    await TestBed.configureTestingModule({
      imports: [UIDropdownDivider],
    }).compileComponents();

    const fixture = TestBed.createComponent(UIDropdownDivider);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have role="separator"', async () => {
    await TestBed.configureTestingModule({
      imports: [UIDropdownDivider],
    }).compileComponents();

    const fixture = TestBed.createComponent(UIDropdownDivider);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute("role")).toBe("separator");
  });
});
