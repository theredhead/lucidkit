import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UIRepeater } from "../../repeater.component";
import { ArrayDatasource } from "../../../table-view/datasources/array-datasource";

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
  selector: "ui-repeater-flex-row-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./flex-row-wrap.story.html",
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 8px;
      overflow: hidden;
      background: var(--theredhead-surface, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));
      transition: transform 0.15s ease;
    }
    .tile:hover {
      transform: scale(1.04);
    }
    .tile.even {
      border: 2px solid var(--theredhead-primary, #6750a4);
    }
    .tile img {
      display: block;
      width: 120px;
      height: 120px;
      object-fit: cover;
    }
    .label {
      padding: 4px 8px;
      font:
        400 0.75rem/1.4 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #444);
    }

    :host-context(html.dark-theme) {
      .tile {
        background: #1e2128;
      }
      .tile.even {
        border-color: #b0a0d8;
      }
      .label {
        color: #d0d5dd;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .tile {
          background: #1e2128;
        }
        .tile.even {
          border-color: #b0a0d8;
        }
        .label {
          color: #d0d5dd;
        }
      }
    }
  `,
})
export class RepeaterFlexRowDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}
