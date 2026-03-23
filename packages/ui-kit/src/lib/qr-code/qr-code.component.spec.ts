import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIQRCode } from "./qr-code.component";

describe("UIQRCode", () => {
  let fixture: ComponentFixture<UIQRCode>;
  let component: UIQRCode;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIQRCode],
    }).compileComponents();
    fixture = TestBed.createComponent(UIQRCode);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.componentRef.setInput("value", "test");
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should render SVG with correct size", () => {
    fixture.componentRef.setInput("value", "test");
    fixture.componentRef.setInput("size", 200);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector("svg");
    expect(svg.getAttribute("width")).toBe("200");
    expect(svg.getAttribute("height")).toBe("200");
  });

  it("should render matrix cells as rects", () => {
    fixture.componentRef.setInput("value", "x"); // matrix will have diagonal pattern
    fixture.detectChanges();
    const rects = fixture.nativeElement.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  });

  it("should apply foreground and background colors", () => {
    fixture.componentRef.setInput("value", "test");
    fixture.componentRef.setInput("foreground", "#123456");
    fixture.componentRef.setInput("background", "#abcdef");
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector("svg");
    const styleAttr = svg.getAttribute("style") || "";
    expect(styleAttr.includes("background: #abcdef")).toBeTruthy();
    const rect = fixture.nativeElement.querySelector("rect");
    if (!rect) {
      // Log SVG for debugging
       
      console.log("SVG output:", fixture.nativeElement.innerHTML);
    }
    expect(rect).toBeTruthy();
    if (rect) {
      expect(rect.getAttribute("fill")).toBe("#123456");
    }
  });

  it("should set aria-label", () => {
    fixture.componentRef.setInput("value", "test");
    fixture.componentRef.setInput("ariaLabel", "Scan me");
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector("svg");
    expect(svg.getAttribute("aria-label")).toBe("Scan me");
  });
});
