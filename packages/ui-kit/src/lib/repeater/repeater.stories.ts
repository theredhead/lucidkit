import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIRepeater } from "./repeater.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";

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
  template: `
    <ui-repeater [datasource]="ds">
      <ng-template let-photo let-i="index">
        <figure class="card">
          <img
            [src]="photo.url"
            [alt]="photo.name"
            loading="lazy"
            width="200"
            height="200"
          />
          <figcaption>#{{ i + 1 }} {{ photo.name }}</figcaption>
        </figure>
      </ng-template>
    </ui-repeater>
  `,
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
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
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
  `,
})
class RepeaterGridDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}

@Component({
  selector: "ui-repeater-flex-row-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-repeater [datasource]="ds">
      <ng-template let-photo let-even="even">
        <div class="tile" [class.even]="even">
          <img
            [src]="photo.url"
            [alt]="photo.name"
            loading="lazy"
            width="120"
            height="120"
          />
          <span class="label">{{ photo.name }}</span>
        </div>
      </ng-template>
    </ui-repeater>
  `,
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
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  `,
})
class RepeaterFlexRowDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}

@Component({
  selector: "ui-repeater-flex-column-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-repeater [datasource]="ds" [limit]="6">
      <ng-template let-photo let-first="first" let-last="last">
        <div class="row" [class.first]="first" [class.last]="last">
          <img
            [src]="photo.url"
            [alt]="photo.name"
            loading="lazy"
            width="64"
            height="64"
          />
          <div class="info">
            <strong>{{ photo.name }}</strong>
            <span class="meta">{{ photo.width }}×{{ photo.height }}</span>
          </div>
        </div>
      </ng-template>
    </ui-repeater>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-width: 360px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      background: var(--theredhead-surface, #fff);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
  `,
})
class RepeaterFlexColumnDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}

@Component({
  selector: "ui-repeater-masonry-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-repeater [datasource]="ds">
      <ng-template let-photo let-i="index" let-odd="odd">
        <div class="brick" [style.height.px]="180 + (i % 3) * 60">
          <img [src]="photo.url" [alt]="photo.name" loading="lazy" />
          <span class="overlay">{{ photo.name }}</span>
        </div>
      </ng-template>
    </ui-repeater>
  `,
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
      color: #fff;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
    }
  `,
})
class RepeaterMasonryDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}

/* ── Storybook meta ───────────────────────────────────────────── */

const meta: Meta<UIRepeater> = {
  title: "@Theredhead/UI Kit/Repeater",
  component: UIRepeater,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRepeater` iterates over a datasource and stamps out an `<ng-template>` for each item — similar to `*ngFor` but driven by a pluggable `ArrayDatasource`. It adds **zero layout opinions**: the host component fully controls the CSS layout (grid, flex, columns, etc.).",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        RepeaterGridDemo,
        RepeaterFlexRowDemo,
        RepeaterFlexColumnDemo,
        RepeaterMasonryDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIRepeater>;

/**
 * **CSS Grid** — responsive auto-fill columns with photo cards.
 * Shows how the repeater adds zero layout constraints:
 * the grid is defined entirely by the host component.
 */
export const Grid: Story = {
  render: () => ({
    template: `<ui-repeater-grid-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — accepts any `ArrayDatasource<T>` (same interface used by `<ui-table-view>`)",
          "- **Template context** — each item template receives `$implicit` (the item), plus `index`, `first`, `last`, `even`, `odd` context variables",
          "- **Limit** — optionally cap the number of rendered items with `[limit]`",
          "- **Layout-agnostic** — no wrapper element or layout styles; the host decides the visual arrangement",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `ArrayDatasource<T>` | *(required)* | The data to iterate over |",
          "| `limit` | `number` | — | Maximum items to render |",
          "",
          "## Template Context",
          "",
          "| Variable | Type | Description |",
          "|----------|------|-------------|",
          "| `$implicit` | `T` | The current item |",
          "| `index` | `number` | Zero-based item index |",
          "| `first` | `boolean` | `true` for the first item |",
          "| `last` | `boolean` | `true` for the last item |",
          "| `even` | `boolean` | `true` for even-indexed items |",
          "| `odd` | `boolean` | `true` for odd-indexed items |",
        ].join("\n"),
      },
      source: {
        code: `<ui-repeater [datasource]="ds">
  <ng-template let-photo let-i="index">
    <figure class="card">
      <img [src]="photo.url" [alt]="photo.name" />
      <figcaption>#{{ i + 1 }} {{ photo.name }}</figcaption>
    </figure>
  </ng-template>
</ui-repeater>

<!-- Component class:
readonly ds = new ArrayDatasource(photos); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **Flex row wrap** — items wrap naturally.
 * Even-indexed items receive a primary-colour border
 * using the `even` context variable.
 */
export const FlexRowWrap: Story = {
  render: () => ({
    template: `<ui-repeater-flex-row-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-repeater [datasource]="ds">
  <ng-template let-photo let-even="even">
    <div class="tile" [class.even]="even">
      <img [src]="photo.url" [alt]="photo.name" />
      <span>{{ photo.name }}</span>
    </div>
  </ng-template>
</ui-repeater>`,
        language: "html",
      },
    },
  },
};

/**
 * **Flex column** — vertical list capped to 6 items.
 * Demonstrates the `limit` input and the `first` / `last` context variables.
 */
export const FlexColumn: Story = {
  render: () => ({
    template: `<ui-repeater-flex-column-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-repeater [datasource]="ds" [limit]="6">
  <ng-template let-photo let-first="first" let-last="last">
    <div class="row" [class.first]="first" [class.last]="last">
      <img [src]="photo.url" [alt]="photo.name" />
      <div class="info">
        <strong>{{ photo.name }}</strong>
        <span>{{ photo.width }}×{{ photo.height }}</span>
      </div>
    </div>
  </ng-template>
</ui-repeater>`,
        language: "html",
      },
    },
  },
};

/**
 * **CSS columns (masonry-like)** — a Pinterest-style staggered layout.
 * Brick heights vary per index to create visual variety.
 */
export const Masonry: Story = {
  render: () => ({
    template: `<ui-repeater-masonry-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-repeater [datasource]="ds">
  <ng-template let-photo let-i="index" let-odd="odd">
    <div class="brick" [style.height.px]="180 + (i % 3) * 60">
      <img [src]="photo.url" [alt]="photo.name" />
      <span class="overlay">{{ photo.name }}</span>
    </div>
  </ng-template>
</ui-repeater>`,
        language: "html",
      },
    },
  },
};
