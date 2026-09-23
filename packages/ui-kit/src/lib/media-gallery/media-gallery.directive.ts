import {
  Directive,
  effect,
  inject,
  input,
} from "@angular/core";

import { UIImage } from "../image/image.component";
import { UIMediaPlayer } from "../media-player/media-player.component";
import { MediaGalleryService } from "./media-gallery.service";
import type { MediaGalleryItem } from "./media-gallery.types";

let nextGalleryItemId = 0;

/** Registers a UIImage or UIMediaPlayer in a gallery collection. */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "ui-image[gallery], ui-media-player[gallery]",
  standalone: true,
  host: {
    tabindex: "0",
    role: "button",
    "(click)": "onHostClick($event)",
    "(keydown.enter)": "open()",
    "(keydown.space)": "onSpace($event)",
  },
})
export class UIMediaGalleryItem {
  /** Gallery collection name; an empty attribute joins the unnamed collection. */
  public readonly gallery = input<string | undefined>(undefined);

  private readonly image = inject(UIImage, { optional: true });
  private readonly mediaPlayer = inject(UIMediaPlayer, { optional: true });
  private readonly service = inject(MediaGalleryService);
  private readonly id = `media-gallery-item-${++nextGalleryItemId}`;

  public constructor() {
    effect((onCleanup) => {
      const item = this.createItem();
      if (!item) return;
      onCleanup(this.service.register(item));
    });
  }

  /** @internal Open this host's registered item. */
  public open(): void {
    this.service.open(this.id);
  }

  /** @internal Prevent Space from scrolling the page when opening. */
  public onSpace(event: KeyboardEvent): void {
    event.preventDefault();
    this.open();
  }

  /** @internal Open host media but leave native playback controls functional. */
  public onHostClick(event: MouseEvent): void {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest("button, input, select, textarea")
    ) {
      return;
    }
    this.open();
  }

  private createItem(): MediaGalleryItem | null {
    const collection = this.gallery() ?? "";
    if (this.image) {
      return {
        id: this.id,
        collection,
        kind: "image",
        src: this.image.src(),
        alt: this.image.ariaLabel() ?? this.image.alt(),
      };
    }

    const player = this.mediaPlayer;
    if (!player || player.type() !== "video") return null;
    const source = player.source() ?? player.sources()[0];
    const src = source?.url;
    if (!src) return null;

    return {
      id: this.id,
      collection,
      kind: "video",
      src,
      poster: player.poster() || undefined,
      type: source.type,
      alt: player.ariaLabel(),
    };
  }
}
