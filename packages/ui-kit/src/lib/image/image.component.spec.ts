import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIImage } from "./image.component";

// ── IntersectionObserver mock ────────────────────────────────────────
let observerCallback: IntersectionObserverCallback;
let observerInstance: {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  observerInstance = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };

  // Must be a real class so `new IntersectionObserver(…)` works
  class MockIntersectionObserver {
    public constructor(cb: IntersectionObserverCallback) {
      observerCallback = cb;
      Object.assign(this, observerInstance);
    }
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Simulate the element entering the viewport. */
function triggerIntersection(isIntersecting: boolean): void {
  observerCallback(
    [{ isIntersecting } as IntersectionObserverEntry],
    observerInstance as unknown as IntersectionObserver,
  );
}

describe("UIImage", () => {
  let component: UIImage;
  let fixture: ComponentFixture<UIImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIImage],
    }).compileComponents();
    fixture = TestBed.createComponent(UIImage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("src", "https://example.com/photo.jpg");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("lazy loading", () => {
    it("should show placeholder before entering viewport", () => {
      const placeholder = fixture.nativeElement.querySelector(
        ".ui-image__placeholder",
      );
      const img = fixture.nativeElement.querySelector("img");

      expect(placeholder).toBeTruthy();
      expect(img).toBeNull();
    });

    it("should render img after entering viewport", () => {
      triggerIntersection(true);
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.src).toBe("https://example.com/photo.jpg");
    });

    it("should not render img for non-intersecting entries", () => {
      triggerIntersection(false);
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector("img");
      expect(img).toBeNull();
    });

    it("should disconnect observer after intersection", () => {
      triggerIntersection(true);
      expect(observerInstance.disconnect).toHaveBeenCalled();
    });
  });

  describe("defaults", () => {
    it('should default alt to ""', () => {
      triggerIntersection(true);
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector("img");
      expect(img.alt).toBe("");
    });
  });

  describe("inputs", () => {
    it("should forward alt to img", () => {
      fixture.componentRef.setInput("alt", "A scenic landscape");
      triggerIntersection(true);
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector("img");
      expect(img.alt).toBe("A scenic landscape");
    });

    it("should set host width", () => {
      fixture.componentRef.setInput("width", 200);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.width).toBe("200px");
    });

    it("should set host height", () => {
      fixture.componentRef.setInput("height", 150);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.height).toBe("150px");
    });
  });

  describe("load state", () => {
    it("should add ui-image--loaded class after load", () => {
      triggerIntersection(true);
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector("img");
      img.dispatchEvent(new Event("load"));
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains("ui-image--loaded")).toBe(
        true,
      );
    });

    it("should add ui-image--error class on error", () => {
      triggerIntersection(true);
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector("img");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains("ui-image--error")).toBe(
        true,
      );
    });
  });

  describe("host class", () => {
    it("should have ui-image class", () => {
      expect(fixture.nativeElement.classList.contains("ui-image")).toBe(true);
    });
  });
});
