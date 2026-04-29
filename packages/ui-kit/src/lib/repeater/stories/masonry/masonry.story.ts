import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIRepeater } from "../../repeater.component";
import { ArrayDatasource } from "../../../table-view/datasources/array-datasource";
import type {
  RepeaterReorderEvent,
  RepeaterTransferEvent,
} from "../../repeater.types";

/* ── demo data ────────────────────────────────────────────────── */

interface Photo {
  id: number;
  name: string;
  width: number;
  height: number;
  url: string;
}

const PHOTO_NAMES = [
  "Whiskers",
  "Mittens",
  "Shadow",
  "Pumpkin",
  "Luna",
  "Simba",
  "Mochi",
  "Cleo",
  "Ginger",
  "Felix",
  "Nala",
  "Oliver",
];

function buildPhotos(count = 12): Photo[] {
  return Array.from({ length: count }, (_, i) => {
    const w = 200 + (i % 4) * 50;
    const h = 200 + ((i + 2) % 3) * 50;
    return {
      id: i + 1,
      name: PHOTO_NAMES[i % PHOTO_NAMES.length],
      width: w,
      height: h,
      url: `https://picsum.photos/seed/photo${i + 1}/${w}/${h}`,
    };
  });
}

const PHOTOS = buildPhotos();

@Component({
  selector: "ui-repeater-masonry-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./masonry.story.html",
  styles: `
    :host {
      columns: 3 220px;
      column-gap: 12px;
      padding: 16px;
    }
    .brick {
      position: relative;
      break-inside: avoid;
      margin-bottom: 12px;
      border-radius: 8px;
      overflow: hidden;
    }
    .brick img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 6px 10px;
      font:
        600 0.8rem/1.4 system-ui,
        sans-serif;
      color: var(--ui-overlay-text, #fff);
      background: var(
        --ui-overlay-bg,
        linear-gradient(transparent, rgba(0, 0, 0, 0.55))
      );
    }
  `,
})
export class RepeaterMasonryDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}
