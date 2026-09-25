import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { CdkTrapFocus } from "@angular/cdk/a11y";

import { UIMediaGallery } from "./media-gallery.component";
import { MediaGalleryService } from "./media-gallery.service";
import { MEDIA_GALLERY_IDLE_DELAY } from "./media-gallery.tokens";
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

    it("should focus the close action and restore the previously focused element", async () => {
        const origin = document.createElement("button");
        document.body.append(origin);
        origin.focus();

        service.close();
        fixture.detectChanges();
        service.open(first.id);
        fixture.detectChanges();
        await Promise.resolve();

        expect(document.activeElement).toBe(
            fixture.nativeElement.querySelector('[aria-label="Close"]'),
        );

        service.close();
        fixture.detectChanges();
        await Promise.resolve();
        expect(document.activeElement).toBe(origin);
        origin.remove();
    });

    it("should enable the CDK focus trap in fullscreen mode", () => {
        const trap = fixture.debugElement.query(By.directive(CdkTrapFocus))
            .injector.get(CdkTrapFocus);

        expect(trap.enabled).toBe(true);
    });

    it("should reveal controls when keyboard focus enters them", () => {
        const close: HTMLButtonElement =
            fixture.nativeElement.querySelector('[aria-label="Close"]');
        close.focus();
        close.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        fixture.detectChanges();

        expect(close.classList).toContain("visible");
        expect(fixture.nativeElement.querySelector(".filmstrip").classList)
            .toContain("visible");
    });

    it("should default idle delay to three seconds", () => {
        expect(fixture.componentInstance.idleDelay()).toBe(3000);
    });

    it("should show controls on pointer movement and hide them after three seconds", () => {
        vi.useFakeTimers();
        try {
            const viewer = fixture.nativeElement.querySelector(".viewer");
            const close = fixture.nativeElement.querySelector(".close");
            const next = fixture.nativeElement.querySelector(".next");
            const filmstrip = fixture.nativeElement.querySelector(".filmstrip");
            expect(close.classList).not.toContain("visible");
            expect(next.classList).not.toContain("visible");
            expect(filmstrip.classList).not.toContain("visible");
            expect(viewer.classList).not.toContain("cursor-hidden");

            viewer.dispatchEvent(
                new PointerEvent("pointermove", { clientX: 500, clientY: 400 }),
            );
            fixture.detectChanges();
            expect(close.classList).toContain("visible");
            expect(next.classList).toContain("visible");
            expect(filmstrip.classList).toContain("visible");
            expect(viewer.classList).not.toContain("cursor-hidden");

            vi.advanceTimersByTime(2999);
            fixture.detectChanges();
            expect(close.classList).toContain("visible");

            vi.advanceTimersByTime(1);
            fixture.detectChanges();
            expect(close.classList).not.toContain("visible");
            expect(next.classList).not.toContain("visible");
            expect(filmstrip.classList).not.toContain("visible");
            expect(viewer.classList).toContain("cursor-hidden");
        } finally {
            vi.useRealTimers();
        }
    });

    it("should use the configured idle delay", () => {
        vi.useFakeTimers();
        try {
            fixture.componentRef.setInput("idleDelay", 1000);
            fixture.detectChanges();
            const viewer = fixture.nativeElement.querySelector(".viewer");
            const close = fixture.nativeElement.querySelector(".close");

            viewer.dispatchEvent(new PointerEvent("pointermove"));
            fixture.detectChanges();
            expect(close.classList).toContain("visible");

            vi.advanceTimersByTime(999);
            fixture.detectChanges();
            expect(close.classList).toContain("visible");

            vi.advanceTimersByTime(1);
            fixture.detectChanges();
            expect(close.classList).not.toContain("visible");
            expect(viewer.classList).toContain("cursor-hidden");
        } finally {
            vi.useRealTimers();
        }
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

    it("should navigate fullscreen media with the left and right arrow keys", () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".media").src).toContain(
            "/second.jpg",
        );

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".media").src).toContain(
            "/first.jpg",
        );
    });

    it("should apply an opt-in slide transition in the navigation direction", () => {
        fixture.componentRef.setInput("transition", "slide");
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(".media-frame").classList)
            .not.toContain("transition-slide");

        fixture.nativeElement.querySelector('[aria-label="Next"]').click();
        fixture.detectChanges();
        let frame = fixture.nativeElement.querySelector(".media-frame");
        expect(frame.classList).toContain("transition-slide");
        expect(frame.classList).toContain("forward");

        fixture.nativeElement.querySelector('[aria-label="Previous"]').click();
        fixture.detectChanges();
        frame = fixture.nativeElement.querySelector(".media-frame");
        expect(frame.classList).toContain("transition-slide");
        expect(frame.classList).toContain("backward");
    });

    it("should not apply transition classes by default", () => {
        fixture.nativeElement.querySelector('[aria-label="Next"]').click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(".media-frame").className)
            .toBe("media-frame");
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

    it("should restore body scrolling when an inline gallery also exists", () => {
        service.close();
        document.body.style.overflow = "";
        const inlineFixture = TestBed.createComponent(UIMediaGallery);
        inlineFixture.componentRef.setInput("inline", true);
        inlineFixture.componentRef.setInput("items", [first, second]);
        inlineFixture.detectChanges();

        service.open(first.id);
        fixture.detectChanges();
        inlineFixture.detectChanges();
        expect(document.body.style.overflow).toBe("hidden");

        service.close();
        fixture.detectChanges();
        inlineFixture.detectChanges();
        expect(document.body.style.overflow).toBe("");
        inlineFixture.destroy();
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

    it("should preserve page wheel scrolling for constrained inline images", () => {
        service.close();
        fixture.componentRef.setInput("inline", true);
        fixture.componentRef.setInput("items", [first, second]);
        fixture.detectChanges();
        const stage = fixture.nativeElement.querySelector(".stage");
        const event = new WheelEvent("wheel", {
            deltaY: -100,
            cancelable: true,
        });

        stage.dispatchEvent(event);
        fixture.detectChanges();

        expect(event.defaultPrevented).toBe(false);
        expect(fixture.nativeElement.querySelector(".media").style.transform)
            .toContain("scale(1)");
        expect(stage.classList).not.toContain("interactive-image");
    });

    it("should preserve wheel scrolling and panning for fullscreen video", () => {
        const video: MediaGalleryItem = {
            id: "video",
            collection: "demo",
            kind: "video",
            src: "/video.mp4",
            alt: "Video",
        };
        service.register(video);
        service.open(video.id);
        fixture.detectChanges();
        const stage = fixture.nativeElement.querySelector(".stage");
        const event = new WheelEvent("wheel", {
            deltaY: -100,
            cancelable: true,
        });

        stage.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(false);
        expect(stage.classList).not.toContain("interactive-image");
    });

    it("should cover inline frames and contain fullscreen images", () => {
        service.close();
        fixture.componentRef.setInput("inline", true);
        fixture.componentRef.setInput("items", [first, second]);
        fixture.detectChanges();

        const inlineImage: HTMLImageElement =
            fixture.nativeElement.querySelector(".media");
        expect(inlineImage.classList).toContain("cover");
        expect(inlineImage.classList).not.toContain("contain");

        fixture.nativeElement.querySelector(".stage").click();
        fixture.detectChanges();

        const fullscreenImage: HTMLImageElement =
            fixture.nativeElement.querySelector(".media");
        expect(fullscreenImage.classList).toContain("contain");
        expect(fullscreenImage.classList).not.toContain("cover");
        expect(fullscreenImage.style.transform).toContain("scale(1)");
    });

    it("should fit a landscape image to both runtime stage dimensions", () => {
        const imageElement: HTMLImageElement =
            fixture.nativeElement.querySelector(".media");
        const stage = fixture.nativeElement.querySelector(".stage");
        Object.defineProperty(imageElement, "naturalWidth", { value: 400 });
        Object.defineProperty(imageElement, "naturalHeight", { value: 200 });
        Object.defineProperty(stage, "clientWidth", { value: 800 });
        Object.defineProperty(stage, "clientHeight", { value: 600 });

        imageElement.dispatchEvent(new Event("load"));
        fixture.detectChanges();

        expect(imageElement.style.width).toBe("800px");
        expect(imageElement.style.height).toBe("400px");
    });

    it("should fit a portrait image to both runtime stage dimensions", () => {
        const imageElement: HTMLImageElement =
            fixture.nativeElement.querySelector(".media");
        const stage = fixture.nativeElement.querySelector(".stage");
        Object.defineProperty(imageElement, "naturalWidth", { value: 200 });
        Object.defineProperty(imageElement, "naturalHeight", { value: 400 });
        Object.defineProperty(stage, "clientWidth", { value: 800 });
        Object.defineProperty(stage, "clientHeight", { value: 600 });

        imageElement.dispatchEvent(new Event("load"));
        fixture.detectChanges();

        expect(imageElement.style.width).toBe("300px");
        expect(imageElement.style.height).toBe("600px");
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

    it("should suppress native dragging and stop panning on pointer up", () => {
        const stage = fixture.nativeElement.querySelector(".stage");
        const imageElement: HTMLImageElement =
            fixture.nativeElement.querySelector(".image");
        const setPointerCapture = vi.fn();
        const releasePointerCapture = vi.fn();
        Object.defineProperty(stage, "setPointerCapture", {
            value: setPointerCapture,
        });
        Object.defineProperty(stage, "releasePointerCapture", {
            value: releasePointerCapture,
        });
        stage.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));

        const dragEvent = new Event("dragstart", { cancelable: true });
        imageElement.dispatchEvent(dragEvent);
        expect(imageElement.draggable).toBe(false);
        expect(dragEvent.defaultPrevented).toBe(true);

        const down = new PointerEvent("pointerdown", {
            pointerId: 7,
            clientX: 10,
            clientY: 20,
            cancelable: true,
        });
        stage.dispatchEvent(down);
        stage.dispatchEvent(new PointerEvent("pointermove", {
            pointerId: 7,
            clientX: 40,
            clientY: 60,
        }));
        stage.dispatchEvent(new PointerEvent("pointerup", { pointerId: 7 }));
        stage.dispatchEvent(new PointerEvent("pointermove", {
            pointerId: 7,
            clientX: 80,
            clientY: 100,
        }));
        fixture.detectChanges();

        expect(down.defaultPrevented).toBe(true);
        expect(setPointerCapture).toHaveBeenCalledWith(7);
        expect(releasePointerCapture).toHaveBeenCalledWith(7);
        expect(imageElement.style.transform).toContain("translate(30px, 40px)");
    });

    it("should render a constrained inline collection with a filmstrip by default", () => {
        service.close();
        fixture.componentRef.setInput("inline", true);
        fixture.componentRef.setInput("items", [first, second]);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
        const previews = fixture.nativeElement.querySelectorAll(".preview");
        expect(previews).toHaveLength(2);
        expect(fixture.nativeElement.querySelector(".inline-viewer")).toBeTruthy();
        expect(fixture.nativeElement.querySelector(".media").src).toContain(
            "/first.jpg",
        );

        previews[1].click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".media").src).toContain(
            "/second.jpg",
        );
    });

    it("should hide the filmstrip when showFilmstrip is false", () => {
        service.close();
        fixture.componentRef.setInput("inline", true);
        fixture.componentRef.setInput("items", [first, second]);
        fixture.componentRef.setInput("showFilmstrip", false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(".filmstrip")).toBeNull();
    });

    it("should expand an inline gallery to fullscreen when its media is activated", () => {
        service.close();
        document.body.style.overflow = "";
        fixture.componentRef.setInput("inline", true);
        fixture.componentRef.setInput("items", [first, second]);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
        fixture.nativeElement.querySelector(".stage").click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
        expect(document.body.style.overflow).toBe("hidden");

        fixture.nativeElement.querySelector('[aria-label="Close"]').click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
        expect(document.body.style.overflow).toBe("");
    });
});

describe("UIMediaGallery idle delay provider", () => {
    it("should use an injected idle delay default", async () => {
        await TestBed.configureTestingModule({
            imports: [UIMediaGallery],
            providers: [{ provide: MEDIA_GALLERY_IDLE_DELAY, useValue: 750 }],
        }).compileComponents();

        const fixture = TestBed.createComponent(UIMediaGallery);

        expect(fixture.componentInstance.idleDelay()).toBe(750);
    });
});
