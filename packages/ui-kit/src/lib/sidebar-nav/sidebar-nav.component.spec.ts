import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIIcons } from "../icon/lucide-icons.generated";
import {
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "./sidebar-nav.component";

/* ── UISidebarItem ── */

describe("UISidebarItem", () => {
  let component: UISidebarItem;
  let fixture: ComponentFixture<UISidebarItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISidebarItem],
    }).compileComponents();

    fixture = TestBed.createComponent(UISidebarItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("label", "Dashboard");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should render label", () => {
      const label = fixture.nativeElement.querySelector(".sidebar-item-label");
      expect(label.textContent.trim()).toBe("Dashboard");
    });

    it("should default active to false", () => {
      expect(component.active()).toBe(false);
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should default icon to empty", () => {
      expect(component.icon()).toBe("");
    });

    it("should default badge to empty", () => {
      expect(component.badge()).toBe("");
    });
  });

  describe("icon", () => {
    it("should render ui-icon when icon SVG is provided", () => {
      fixture.componentRef.setInput(
        "icon",
        UIIcons.Lucide.Layout.LayoutDashboard,
      );
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector("ui-icon");
      expect(icon).toBeTruthy();
    });

    it("should not render ui-icon when icon is empty", () => {
      const icon = fixture.nativeElement.querySelector("ui-icon");
      expect(icon).toBeFalsy();
    });
  });

  describe("badge", () => {
    it("should render badge when provided", () => {
      fixture.componentRef.setInput("badge", "5");
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector(".sidebar-item-badge");
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBe("5");
    });

    it("should not render badge when empty", () => {
      const badge = fixture.nativeElement.querySelector(".sidebar-item-badge");
      expect(badge).toBeFalsy();
    });
  });

  describe("active state", () => {
    it("should apply active host class", () => {
      fixture.componentRef.setInput("active", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(
        "ui-sidebar-item--active",
      );
    });

    it("should set aria-selected when active", () => {
      fixture.componentRef.setInput("active", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("disabled state", () => {
    it("should apply disabled host class", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(
        "ui-sidebar-item--disabled",
      );
    });

    it("should set aria-disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-disabled")).toBe("true");
    });

    it("should set tabindex -1 when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("tabindex")).toBe("-1");
    });

    it("should not emit activated when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const spy = vi.fn();
      component.activated.subscribe(spy);
      component.onActivate();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("interaction", () => {
    it("should emit activated on click", () => {
      const spy = vi.fn();
      component.activated.subscribe(spy);
      fixture.nativeElement.click();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should emit activated on Enter key", () => {
      const spy = vi.fn();
      component.activated.subscribe(spy);
      fixture.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("accessibility", () => {
    it('should have role="treeitem"', () => {
      expect(fixture.nativeElement.getAttribute("role")).toBe("treeitem");
    });

    it("should have tabindex 0 when enabled", () => {
      expect(fixture.nativeElement.getAttribute("tabindex")).toBe("0");
    });
  });
});

/* ── UISidebarGroup ── */

describe("UISidebarGroup", () => {
  let component: UISidebarGroup;
  let fixture: ComponentFixture<UISidebarGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISidebarGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(UISidebarGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("label", "Settings");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should render label", () => {
      const label = fixture.nativeElement.querySelector(".sidebar-group-label");
      expect(label.textContent.trim()).toBe("Settings");
    });

    it("should default expanded to true", () => {
      expect(component.expanded()).toBe(true);
    });

    it("should default icon to empty", () => {
      expect(component.icon()).toBe("");
    });
  });

  describe("icon", () => {
    it("should render ui-icon when icon SVG is provided", () => {
      fixture.componentRef.setInput("icon", UIIcons.Lucide.Account.Settings);
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector("ui-icon");
      expect(icon).toBeTruthy();
    });
  });

  describe("collapse / expand", () => {
    it("should apply expanded host class when expanded", () => {
      expect(fixture.nativeElement.classList).toContain(
        "ui-sidebar-group--expanded",
      );
    });

    it("should render content when expanded", () => {
      const content = fixture.nativeElement.querySelector(
        ".sidebar-group-content",
      );
      expect(content).toBeTruthy();
    });

    it("should collapse on toggle", () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.expanded()).toBe(false);
      expect(fixture.nativeElement.classList).not.toContain(
        "ui-sidebar-group--expanded",
      );
    });

    it("should hide content when collapsed", () => {
      component.toggle();
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector(
        ".sidebar-group-content",
      );
      expect(content).toBeFalsy();
    });

    it("should toggle on header click", () => {
      const header = fixture.nativeElement.querySelector(
        ".sidebar-group-header",
      ) as HTMLElement;
      header.click();
      fixture.detectChanges();
      expect(component.expanded()).toBe(false);
    });

    it("should toggle on Enter key", () => {
      const header = fixture.nativeElement.querySelector(
        ".sidebar-group-header",
      ) as HTMLElement;
      header.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.expanded()).toBe(false);
    });
  });

  describe("accessibility", () => {
    it("should have aria-expanded on header", () => {
      const header = fixture.nativeElement.querySelector(
        ".sidebar-group-header",
      );
      expect(header.getAttribute("aria-expanded")).toBe("true");
    });

    it('should have role="button" on header', () => {
      const header = fixture.nativeElement.querySelector(
        ".sidebar-group-header",
      );
      expect(header.getAttribute("role")).toBe("button");
    });

    it('should have role="group" on content', () => {
      const content = fixture.nativeElement.querySelector(
        ".sidebar-group-content",
      );
      expect(content.getAttribute("role")).toBe("group");
    });
  });
});

/* ── UISidebarNav ── */

describe("UISidebarNav", () => {
  let fixture: ComponentFixture<UISidebarNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISidebarNav],
    }).compileComponents();

    fixture = TestBed.createComponent(UISidebarNav);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe("accessibility", () => {
    it('should have role="navigation"', () => {
      expect(fixture.nativeElement.getAttribute("role")).toBe("navigation");
    });

    it("should have default aria-label", () => {
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "Sidebar navigation",
      );
    });

    it("should forward custom aria-label", () => {
      fixture.componentRef.setInput("ariaLabel", "Admin navigation");
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "Admin navigation",
      );
    });
  });

  it("should render tree container", () => {
    const tree = fixture.nativeElement.querySelector('[role="tree"]');
    expect(tree).toBeTruthy();
  });
});

/* ── Integration ── */

@Component({
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  template: `
    <ui-sidebar-nav>
      <ui-sidebar-item label="Home" [icon]="icons.House" [active]="true" />
      <ui-sidebar-item label="Projects" [icon]="icons.Folder" badge="3" />
      <ui-sidebar-group label="Admin" [icon]="icons.Settings">
        <ui-sidebar-item label="Users" />
        <ui-sidebar-item label="Roles" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  `,
})
class IntegrationHostComponent {
  public readonly icons = {
    House: UIIcons.Lucide.Buildings.House,
    Folder: UIIcons.Lucide.Files.Folder,
    Settings: UIIcons.Lucide.Account.Settings,
  };
}

describe("Sidebar integration", () => {
  let fixture: ComponentFixture<IntegrationHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationHostComponent);
    fixture.detectChanges();
  });

  it("should render all items", () => {
    const items = fixture.nativeElement.querySelectorAll("ui-sidebar-item");
    expect(items.length).toBe(4);
  });

  it("should render group", () => {
    const group = fixture.nativeElement.querySelector("ui-sidebar-group");
    expect(group).toBeTruthy();
  });

  it("should render active item with correct class", () => {
    const active = fixture.nativeElement.querySelector(
      ".ui-sidebar-item--active",
    );
    expect(active).toBeTruthy();
  });

  it("should render badge", () => {
    const badge = fixture.nativeElement.querySelector(".sidebar-item-badge");
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe("3");
  });

  it("should collapse group and hide children", () => {
    const header = fixture.nativeElement.querySelector(
      ".sidebar-group-header",
    ) as HTMLElement;
    header.click();
    fixture.detectChanges();

    const groupContent = fixture.nativeElement.querySelector(
      ".sidebar-group-content",
    );
    expect(groupContent).toBeFalsy();
  });
});
