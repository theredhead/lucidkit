import { ComponentFixture, TestBed } from "@angular/core/testing";

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
