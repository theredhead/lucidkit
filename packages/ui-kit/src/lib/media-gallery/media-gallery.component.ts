import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { UIIcon, UIIcons } from "../icon";
import { UIMediaPlayer } from "../media-player";
import { MediaGalleryService } from "./media-gallery.service";
import type { MediaGalleryItem } from "./media-gallery.types";
import {
    MEDIA_GALLERY_CLOSE_POSITION,
    MEDIA_GALLERY_IDLE_DELAY,
    type MediaGalleryClosePosition,
} from "./media-gallery.tokens";

/** Fullscreen viewer for registered UIImage and UIMediaPlayer collections. */
@Component({
    selector: "ui-media-gallery",
    standalone: true,
    imports: [UIIcon, UIMediaPlayer],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./media-gallery.component.html",
    styleUrl: "./media-gallery.component.scss",
    host: {
        class: "ui-media-gallery",
        "[class.inline]": "isInlineView()",
        "(document:keydown.escape)": "onEscape()",
        "(document:keydown.arrowleft)": "onArrowLeft($event)",
        "(document:keydown.arrowright)": "onArrowRight($event)",
    },
})
export class UIMediaGallery {
    /** Whether backdrop clicks close the viewer. */
    public readonly closeOnBackdropClick = input(true);

    /** Accessible label for the fullscreen viewer. */
    public readonly ariaLabel = input("Media gallery");

    /** Media items for constrained inline mode. */
    public readonly items = input<readonly MediaGalleryItem[]>([]);

    /** Render the supplied items directly on the page instead of fullscreen. */
    public readonly inline = input(false);

    /** Whether the gallery should show the filmstrip. */
    public readonly showFilmstrip = input(true);

    /** Milliseconds of pointer inactivity before controls and cursor hide. */
    public readonly idleDelay = input(inject(MEDIA_GALLERY_IDLE_DELAY));

    /** Initial item index for inline mode. */
    public readonly startIndex = input(0);

    /** Placement of the close button. */
    public readonly closePosition = input<MediaGalleryClosePosition>(
        inject(MEDIA_GALLERY_CLOSE_POSITION),
    );

    /** Shared gallery state. */
    protected readonly gallery = inject(MediaGalleryService);
    protected readonly icons = {
        close: UIIcons.Lucide.Math.X,
        previous: UIIcons.Lucide.Arrows.ChevronLeft,
        next: UIIcons.Lucide.Arrows.ChevronRight,
    } as const;
    protected readonly zoom = signal(1);
    protected readonly panX = signal(0);
    protected readonly panY = signal(0);
    protected readonly inlineIndex = signal(0);
    protected readonly expanded = signal(false);
    protected readonly controlsVisible = signal(false);
    protected readonly cursorHidden = signal(false);
    protected readonly transform = computed(
        () => `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()})`,
    );
    protected readonly activeItems = computed(() => {
        if (this.inline()) return this.items();
        const active = this.gallery.activeItem();
        return active ? this.gallery.items(active.collection) : [];
    });
    protected readonly activeIndex = computed(() => {
        if (this.inline()) {
            return Math.min(
                this.inlineIndex(),
                Math.max(0, this.activeItems().length - 1),
            );
        }
        return this.gallery.activeIndex();
    });
    protected readonly activeItem = computed(
        () => this.activeItems()[this.activeIndex()] ?? null,
    );
    protected readonly isVisible = computed(
        () => this.inline() ? this.activeItems().length > 0 : this.gallery.isOpen(),
    );
    protected readonly isInlineView = computed(
        () => this.inline() && !this.expanded(),
    );
    protected readonly isFullscreen = computed(
        () => this.inline() ? this.expanded() : this.gallery.isOpen(),
    );
    protected readonly canPrevious = computed(() => this.activeIndex() > 0);
    protected readonly canNext = computed(
        () => this.activeIndex() < this.activeItems().length - 1,
    );

    private readonly body = inject(DOCUMENT).body;
    private readonly destroyRef = inject(DestroyRef);
    private lastActiveId: string | null = null;
    private pointerStart: { x: number; y: number } | null = null;
    private panStart: { x: number; y: number } | null = null;
    private controlsTimer: ReturnType<typeof setTimeout> | null = null;
    protected readonly fitScale = signal(1);
    protected readonly stage = viewChild<ElementRef<HTMLElement>>("stage");
    protected readonly minimumZoom = computed(() => Math.max(1, this.fitScale()));

    public constructor() {
        this.destroyRef.onDestroy(() => this.clearControlsTimer());

        effect(() => {
            if (this.inline()) {
                this.inlineIndex.set(
                    Math.min(
                        Math.max(0, this.startIndex()),
                        Math.max(0, this.items().length - 1),
                    ),
                );
            }
        });

        effect((onCleanup) => {
            if (!this.isFullscreen()) return;
            const previousOverflow = this.body.style.overflow;
            this.body.style.overflow = "hidden";
            onCleanup(() => {
                this.body.style.overflow = previousOverflow;
            });
        });

        effect(() => {
            const activeId = this.activeItem()?.id ?? null;
            if (activeId !== this.lastActiveId) {
                this.lastActiveId = activeId;
                this.fitScale.set(1);
                this.zoom.set(1);
                this.panX.set(0);
                this.panY.set(0);
            }
        });
    }

    /** @internal */
    protected onImageLoad(event: Event): void {
        const image = event.currentTarget;
        const stage = this.stage()?.nativeElement;
        if (!(image instanceof HTMLImageElement) || !stage) return;
        if (!image.naturalWidth || !image.naturalHeight) return;

        const widthScale = stage.clientWidth / image.naturalWidth;
        const heightScale = stage.clientHeight / image.naturalHeight;
        const fitScale = Math.max(widthScale, heightScale);
        this.fitScale.set(Number.isFinite(fitScale) ? fitScale : 1);
        this.setZoom(this.zoom());
    }

    /** @internal */
    protected onEscape(): void {
        if (this.isFullscreen()) this.close();
    }

    /** @internal */
    protected onBackdropClick(event: Event): void {
        if (this.isFullscreen() && this.closeOnBackdropClick() && event.target === event.currentTarget) {
            this.close();
        }
    }

    /** @internal */
    protected onBackdropKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") this.close();
    }

    /** @internal */
    protected onArrowLeft(event: KeyboardEvent): void {
        if (!this.isFullscreen() || this.isEditingTarget(event.target)) return;
        event.preventDefault();
        this.onPrevious();
    }

    /** @internal */
    protected onArrowRight(event: KeyboardEvent): void {
        if (!this.isFullscreen() || this.isEditingTarget(event.target)) return;
        event.preventDefault();
        this.onNext();
    }

    /** @internal */
    protected onViewerPointerMove(_event: PointerEvent): void {
        this.controlsVisible.set(true);
        this.cursorHidden.set(false);
        this.clearControlsTimer();
        this.controlsTimer = setTimeout(() => {
            this.controlsVisible.set(false);
            this.cursorHidden.set(true);
            this.controlsTimer = null;
        }, Math.max(0, this.idleDelay()));
    }

    private clearControlsTimer(): void {
        if (this.controlsTimer === null) return;
        clearTimeout(this.controlsTimer);
        this.controlsTimer = null;
    }

    /** @internal */
    protected onPrevious(): void {
        if (this.inline()) {
            this.inlineIndex.update((index) => Math.max(0, index - 1));
        } else {
            this.gallery.previous();
        }
    }

    /** @internal */
    protected onNext(): void {
        if (this.inline()) {
            this.inlineIndex.update((index) =>
                Math.min(this.items().length - 1, index + 1),
            );
        } else {
            this.gallery.next();
        }
    }

    /** @internal */
    protected selectItem(index: number, id: string): void {
        if (this.inline()) {
            this.inlineIndex.set(index);
        } else {
            this.gallery.open(id);
        }
    }

    /** @internal */
    protected onStageClick(event: MouseEvent): void {
        if (!this.isInlineView()) return;
        const target = event.target;
        if (
            target instanceof HTMLElement &&
            target.closest("button, input, select, textarea, [contenteditable='true']")
        ) {
            return;
        }
        this.expandInline(event);
    }

    /** @internal */
    protected expandInline(event: Event): void {
        if (!this.isInlineView()) return;
        event.preventDefault();
        this.expanded.set(true);
    }

    /** @internal */
    protected onWheel(event: WheelEvent): void {
        event.preventDefault();
        const nextZoom = event.deltaY < 0 ? this.zoom() * 1.1 : this.zoom() / 1.1;
        this.setZoom(nextZoom);
    }

    /** @internal */
    protected onDoubleClick(): void {
        this.setZoom(this.zoom() === 1 ? 2 : 1);
    }

    /** @internal */
    protected onPointerDown(event: PointerEvent): void {
        if (this.zoom() <= 1) return;
        this.pointerStart = { x: event.clientX, y: event.clientY };
        this.panStart = { x: this.panX(), y: this.panY() };
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }

    /** @internal */
    protected onPointerMove(event: PointerEvent): void {
        if (!this.pointerStart || !this.panStart) return;
        this.panX.set(this.panStart.x + event.clientX - this.pointerStart.x);
        this.panY.set(this.panStart.y + event.clientY - this.pointerStart.y);
    }

    /** @internal */
    protected onPointerUp(): void {
        this.pointerStart = null;
        this.panStart = null;
    }

    /** @internal */
    protected close(): void {
        if (this.inline()) {
            this.expanded.set(false);
        } else {
            this.gallery.close();
        }
    }

    private isEditingTarget(target: EventTarget | null): boolean {
        return target instanceof HTMLElement &&
            target.matches("input, select, textarea, [contenteditable='true']");
    }

    private setZoom(value: number): void {
        const nextZoom = Math.max(this.minimumZoom(), Math.min(8, value));
        this.zoom.set(nextZoom);
        if (nextZoom === this.minimumZoom()) {
            this.panX.set(0);
            this.panY.set(0);
        }
    }
}
