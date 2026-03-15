import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIIcon } from "./icon.component";
import { UIIcons } from "./lucide-icons.generated";

describe("UIIcon", () => {
  let component: UIIcon;
  let fixture: ComponentFixture<UIIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIIcon],
    }).compileComponents();
    fixture = TestBed.createComponent(UIIcon);
    component = fixture.componentInstance;
  });

  describe("rendering", () => {
    it("should create", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it("should render an SVG element", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    });

    it("should render path content inside the SVG", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.querySelector("path")).toBeTruthy();
    });

    it("should render circle elements for icons that have them", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Search);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.querySelector("circle")).toBeTruthy();
    });
  });

  describe("size", () => {
    it("should default to 24px", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      expect(component.size()).toBe(24);
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("width")).toBe("24");
      expect(svg.getAttribute("height")).toBe("24");
    });

    it("should accept a custom size", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.componentRef.setInput("size", 16);
      fixture.detectChanges();
      expect(component.size()).toBe(16);
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("width")).toBe("16");
      expect(svg.getAttribute("height")).toBe("16");
    });

    it("should apply size to host element styles", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.componentRef.setInput("size", 32);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.style.width).toBe("32px");
      expect(host.style.height).toBe("32px");
    });
  });

  describe("accessibility", () => {
    it("should be aria-hidden when no ariaLabel is provided", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute("aria-hidden")).toBe("true");
      expect(host.getAttribute("aria-label")).toBeNull();
    });

    it("should have aria-label and not be hidden when ariaLabel is set", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.componentRef.setInput("ariaLabel", "Bold text");
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute("aria-label")).toBe("Bold text");
      expect(host.getAttribute("aria-hidden")).not.toBe("true");
    });

    it("should have role=img on host", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute("role")).toBe("img");
    });
  });

  describe("SVG attributes", () => {
    it("should use stroke=currentColor", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("stroke")).toBe("currentColor");
    });

    it("should use fill=none", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("fill")).toBe("none");
    });

    it("should have display: inline-flex on host", () => {
      fixture.componentRef.setInput("svg", UIIcons.Lucide.Text.Bold);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.style.display).toBe("inline-flex");
    });
  });

  describe("registry", () => {
    it("should have categorised icons under UIIcons.Lucide", () => {
      expect(UIIcons.Lucide).toBeTruthy();
      expect(UIIcons.Lucide.Text).toBeTruthy();
      expect(UIIcons.Lucide.Arrows).toBeTruthy();
    });

    it("should have string values for icon entries", () => {
      expect(typeof UIIcons.Lucide.Text.Bold).toBe("string");
      expect(UIIcons.Lucide.Text.Bold.length).toBeGreaterThan(0);
    });

    it("should have valid SVG fragment content (contains path or circle)", () => {
      const content = UIIcons.Lucide.Text.Bold;
      expect(content).toMatch(/<path|<circle|<line|<rect|<polyline|<polygon/);
    });
  });
});
