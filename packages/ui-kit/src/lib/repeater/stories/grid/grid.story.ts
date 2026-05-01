import { ChangeDetectionStrategy, Component, input } from "@angular/core";
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

/* ── wrapper components ───────────────────────────────────────── */

@Component({
  selector: "ui-repeater-grid-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./grid.story.html",
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      padding: 16px;
    }
    .card {
      margin: 0;
      border-radius: 8px;
      overflow: hidden;
      background: var(--theredhead-surface, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));
    }
    .card img {
      display: block;
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card figcaption {
      padding: 8px 12px;
      font:
        500 0.875rem/1.4 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #333);
    }

    :host-context(html.dark-theme) {
      .card {
        background: #1e2128;
      }
      .card figcaption {
        color: #f2f6fb;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .card {
          background: #1e2128;
        }
        .card figcaption {
          color: #f2f6fb;
        }
      }
    }
  `,
})
export class RepeaterGridDemo {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly ds = new ArrayDatasource(PHOTOS);

  public readonly reorderable = input(false);
}
