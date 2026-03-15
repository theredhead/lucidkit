import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIBreadcrumb, type BreadcrumbItem } from "./breadcrumb.component";

const ITEMS: BreadcrumbItem[] = [
  { label: "Home", url: "/" },
  { label: "Products", url: "/products" },
  { label: "Widget" },
];

@Component({
  standalone: true,
  imports: [UIBreadcrumb],
  template: `<ui-breadcrumb [items]="items()" [separator]="separator()" [variant]="variant()" />`,
})
class TestHost {
  public readonly items = signal<BreadcrumbItem[]>([...ITEMS]);
  public readonly separator = signal("/");
  public readonly variant = signal<"link" | "button">("link");
}

describe("UIBreadcrumb", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-breadcrumb")).toBeTruthy();
  });

  it("should render all items", () => {
    const items = fixture.nativeElement.querySelectorAll(".bc-item");
    expect(items.length).toBe(3);
  });

  it("should render item labels", () => {
    const links = fixture.nativeElement.querySelectorAll(".bc-link");
    expect(links[0].textContent.trim()).toBe("Home");
    expect(links[1].textContent.trim()).toBe("Products");
    expect(links[2].textContent.trim()).toBe("Widget");
  });

  it("should render separators between items", () => {
    const seps = fixture.nativeElement.querySelectorAll(".bc-separator");
    expect(seps.length).toBe(2);
    expect(seps[0].textContent.trim()).toBe("/");
  });

  it("should support custom separator", () => {
    host.separator.set("›");
    fixture.detectChanges();
    const seps = fixture.nativeElement.querySelectorAll(".bc-separator");
    expect(seps[0].textContent.trim()).toBe("›");
  });

  it("should mark the last item as current", () => {
    const lastLink = fixture.nativeElement.querySelectorAll(".bc-link")[2];
    expect(lastLink.classList).toContain("bc-link--current");
    expect(lastLink.getAttribute("aria-current")).toBe("page");
  });

  it("should render non-last items as links", () => {
    const links = fixture.nativeElement.querySelectorAll("a.bc-link");
    expect(links.length).toBe(2);
  });

  it("should have nav with aria-label", () => {
    const nav = fixture.nativeElement.querySelector("nav");
    expect(nav.getAttribute("aria-label")).toBe("Breadcrumb");
  });

  it("should have ui-breadcrumb host class", () => {
    expect(
      fixture.nativeElement.querySelector("ui-breadcrumb").classList,
    ).toContain("ui-breadcrumb");
  });

  describe("itemClicked", () => {
    it("should emit on non-last item click", () => {
      const spy = vi.fn();
      const bc = fixture.debugElement.children[0]
        .componentInstance as UIBreadcrumb;
      bc.itemClicked.subscribe(spy);

      const links = fixture.nativeElement.querySelectorAll("a.bc-link");
      links[0].click();
      expect(spy).toHaveBeenCalledWith(ITEMS[0]);
    });
  });

  describe("button variant", () => {
    beforeEach(() => {
      host.variant.set("button");
      fixture.detectChanges();
    });

    it("should render buttons instead of links", () => {
      const buttons = fixture.nativeElement.querySelectorAll(".bc-button");
      expect(buttons.length).toBe(3);
      expect(fixture.nativeElement.querySelectorAll("a.bc-link").length).toBe(
        0,
      );
    });

    it("should render chevron SVG separators", () => {
      const chevrons = fixture.nativeElement.querySelectorAll(".bc-chevron");
      expect(chevrons.length).toBe(2);
      expect(
        fixture.nativeElement.querySelectorAll(".bc-separator").length,
      ).toBe(0);
    });

    it("should disable the last button", () => {
      const buttons = fixture.nativeElement.querySelectorAll(".bc-button");
      expect(buttons[2].disabled).toBe(true);
      expect(buttons[0].disabled).toBe(false);
    });

    it("should mark the last button as current", () => {
      const buttons = fixture.nativeElement.querySelectorAll(".bc-button");
      expect(buttons[2].classList).toContain("bc-button--current");
      expect(buttons[2].getAttribute("aria-current")).toBe("page");
    });

    it("should add ui-breadcrumb--button host class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-breadcrumb").classList,
      ).toContain("ui-breadcrumb--button");
    });

    it("should emit itemClicked on non-last button click", () => {
      const spy = vi.fn();
      const bc = fixture.debugElement.children[0]
        .componentInstance as UIBreadcrumb;
      bc.itemClicked.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll(".bc-button");
      buttons[0].click();
      expect(spy).toHaveBeenCalledWith(ITEMS[0]);
    });
  });
});
