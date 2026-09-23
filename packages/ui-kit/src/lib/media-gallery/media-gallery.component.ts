import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
    "(document:keydown.escape)": "onEscape()",
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

  /** Whether fullscreen mode should show the filmstrip. */
  public readonly showFilmstrip = input(true);

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
  protected readonly canPrevious = computed(() => this.activeIndex() > 0);
  protected readonly canNext = computed(
    () => this.activeIndex() < this.activeItems().length - 1,
  );

  private readonly body = inject(DOCUMENT).body;
  private lastActiveId: string | null = null;
  private pointerStart: { x: number; y: number } | null = null;
  private panStart: { x: number; y: number } | null = null;
  protected readonly fitScale = signal(1);
  protected readonly stage = viewChild<ElementRef<HTMLElement>>("stage");
  protected readonly minimumZoom = computed(() => Math.max(1, this.fitScale()));

  public constructor() {
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
      const isOpen = this.gallery.isOpen();
      if (!isOpen) return;
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
    if (this.gallery.isOpen()) this.gallery.close();
  }

  /** @internal */
  protected onBackdropClick(event: Event): void {
    if (!this.inline() && this.closeOnBackdropClick() && event.target === event.currentTarget) {
      this.gallery.close();
    }
  }

  /** @internal */
  protected onBackdropKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") this.gallery.close();
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

  private setZoom(value: number): void {
    const nextZoom = Math.max(this.minimumZoom(), Math.min(8, value));
    this.zoom.set(nextZoom);
    if (nextZoom === this.minimumZoom()) {
      this.panX.set(0);
      this.panY.set(0);
    }
  }
}
