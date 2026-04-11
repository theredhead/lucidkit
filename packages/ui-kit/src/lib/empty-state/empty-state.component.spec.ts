import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIEmptyState } from "./empty-state.component";

describe("UIEmptyState", () => {
  let component: UIEmptyState;
  let fixture: ComponentFixture<UIEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIEmptyState],
    }).compileComponents();
    fixture = TestBed.createComponent(UIEmptyState);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("heading", "No results");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("heading", () => {
    it("should render the heading text", () => {
      const el = fixture.nativeElement.querySelector(".heading");
      expect(el.textContent.trim()).toBe("No results");
    });
  });

  describe("message", () => {
    it("should not render .message when message is empty", () => {
      expect(fixture.nativeElement.querySelector(".message")).toBeNull();
    });

    it("should render .message when provided", () => {
      fixture.componentRef.setInput("message", "Try again later.");
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(".message");
      expect(el).toBeTruthy();
      expect(el.textContent.trim()).toBe("Try again later.");
    });
  });

  describe("icon", () => {
    it("should not render icon when not provided", () => {
      expect(fixture.nativeElement.querySelector(".icon")).toBeNull();
    });

    it("should render icon when svg provided", () => {
      fixture.componentRef.setInput(
        "icon",
        '<line x1="0" y1="0" x2="24" y2="24" />',
      );
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".icon")).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it('should have role="status"', () => {
      expect(fixture.nativeElement.getAttribute("role")).toBe("status");
    });
  });
});
