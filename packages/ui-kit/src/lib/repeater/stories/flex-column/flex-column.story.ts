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
  selector: "ui-repeater-flex-column-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./flex-column.story.html",
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-width: 360px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--ui-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.08));
      background: var(--theredhead-surface, #fff);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--ui-border, #d7dce2);
    }
    .row.last {
      border-bottom: none;
    }
    .row img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .info strong {
      font:
        500 0.875rem/1.3 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #222);
    }
    .meta {
      font:
        400 0.75rem/1.3 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface-variant, #666);
    }

    :host-context(html.dark-theme) {
      & {
        background: #1e2128;
      }
      .row {
        border-bottom-color: #3a3f47;
      }
      .info strong {
        color: #f2f6fb;
      }
      .meta {
        color: #8b919a;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        & {
          background: #1e2128;
        }
        .row {
          border-bottom-color: #3a3f47;
        }
        .info strong {
          color: #f2f6fb;
        }
        .meta {
          color: #8b919a;
        }
      }
    }
  `,
})
export class RepeaterFlexColumnDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}
