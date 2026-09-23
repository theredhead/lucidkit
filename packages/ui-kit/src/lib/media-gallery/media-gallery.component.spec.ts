import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIMediaGallery } from "./media-gallery.component";
import { MediaGalleryService } from "./media-gallery.service";
import type { MediaGalleryItem } from "./media-gallery.types";

function image(id: string): MediaGalleryItem {
  return {
    id,
    collection: "demo",
    kind: "image",
    src: `/${id}.jpg`,
    alt: `${id} image`,
  };
}

describe("UIMediaGallery", () => {
  let fixture: ComponentFixture<UIMediaGallery>;
  let service: MediaGalleryService;
  let first: MediaGalleryItem;
  let second: MediaGalleryItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIMediaGallery],
    }).compileComponents();
    fixture = TestBed.createComponent(UIMediaGallery);
    service = TestBed.inject(MediaGalleryService);
    first = image("first");
    second = image("second");
    service.register(first);
    service.register(second);
    service.open(first.id);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.close();
  });

  it("should render one active media item in a fullscreen dialog", () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    const images = fixture.nativeElement.querySelectorAll(".media");

    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(images).toHaveLength(1);
    expect(images[0].src).toContain("/first.jpg");
  });

  it("should navigate with previous and next controls", () => {
    const next = fixture.nativeElement.querySelector('[aria-label="Next"]');
    next.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(".media").src).toContain(
      "/second.jpg",
    );

    const previous = fixture.nativeElement.querySelector(
      '[aria-label="Previous"]',
    );
    previous.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(".media").src).toContain(
      "/first.jpg",
    );
  });

  it("should switch items from the filmstrip", () => {
    const previews = fixture.nativeElement.querySelectorAll(".preview");
    previews[1].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(".media").src).toContain(
      "/second.jpg",
    );
  });

  it("should close with Escape and the close button", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();

    service.open(first.id);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[aria-label="Close"]').click();
    expect(service.isOpen()).toBe(false);
  });

  it("should not expose zoom or reset buttons", () => {
    expect(fixture.nativeElement.querySelector('[aria-label="Zoom in"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Zoom out"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Reset zoom"]')).toBeNull();
  });

  it("should zoom in with the wheel and never zoom below the minimum", () => {
    const stage = fixture.nativeElement.querySelector(".stage");
    stage.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".media").style.transform).toContain(
      "scale(1.1)",
    );

    stage.dispatchEvent(new WheelEvent("wheel", { deltaY: 1000 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".media").style.transform).toContain(
      "scale(1)",
    );
  });

  it("should keep an image at the scale required to fill the viewport", () => {
    const imageElement: HTMLImageElement =
      fixture.nativeElement.querySelector(".media");
    const stage = fixture.nativeElement.querySelector(".stage");
    Object.defineProperty(imageElement, "naturalWidth", { value: 400 });
    Object.defineProperty(imageElement, "naturalHeight", { value: 300 });
    Object.defineProperty(stage, "clientWidth", { value: 800 });
    Object.defineProperty(stage, "clientHeight", { value: 600 });
    imageElement.dispatchEvent(new Event("load"));
    fixture.detectChanges();

    stage.dispatchEvent(new WheelEvent("wheel", { deltaY: 1000 }));
    fixture.detectChanges();

    expect(imageElement.style.transform).toContain("scale(2)");
  });

  it("should pan an image after it is zoomed", () => {
    const stage = fixture.nativeElement.querySelector(".stage");
    Object.defineProperty(stage, "setPointerCapture", { value: vi.fn() });
    stage.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    stage.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 10, clientY: 20 }),
    );
    stage.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 40, clientY: 60 }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(".media").style.transform).toContain(
      "translate(30px, 40px)",
    );
  });

  it("should render a constrained inline collection without a filmstrip", () => {
    service.close();
    fixture.componentRef.setInput("inline", true);
    fixture.componentRef.setInput("items", [first, second]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    expect(fixture.nativeElement.querySelector(".filmstrip")).toBeNull();
    expect(fixture.nativeElement.querySelector(".inline-viewer")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".media").src).toContain(
      "/first.jpg",
    );

    fixture.nativeElement.querySelector('[aria-label="Next"]').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".media").src).toContain(
      "/second.jpg",
    );
  });
});
