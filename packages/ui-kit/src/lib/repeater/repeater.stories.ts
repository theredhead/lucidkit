import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIRepeater } from "./repeater.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";
import type {
  RepeaterReorderEvent,
  RepeaterTransferEvent,
} from "./repeater.types";

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
      color: var(--ui-overlay-text, #fff);
      background: var(
        --ui-overlay-bg,
        linear-gradient(transparent, rgba(0, 0, 0, 0.55))
      );
    }
  `,
})
class RepeaterMasonryDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
}

/* ── drag-and-drop wrapper components ─────────────────────────── */

@Component({
  selector: "ui-repeater-reorder-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="heading">Drag items to reorder</h3>
    <ui-repeater
      [datasource]="ds"
      [reorderable]="true"
      [limit]="8"
      (reordered)="onReorder($event)"
    >
      <ng-template let-photo let-i="index">
        <div class="row">
          <span class="handle">⠿</span>
          <img
            [src]="photo.url"
            [alt]="photo.name"
            loading="lazy"
            width="48"
            height="48"
          />
          <div class="info">
            <strong>#{{ i + 1 }} {{ photo.name }}</strong>
            <span class="meta">{{ photo.width }} × {{ photo.height }}</span>
          </div>
        </div>
      </ng-template>
    </ui-repeater>
    @if (lastEvent()) {
      <pre class="log">{{ lastEvent() | json }}</pre>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 420px;
    }
    .heading {
      margin: 0 0 12px;
      font:
        600 1rem/1.4 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #222);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--theredhead-surface, #fff);
      border: 1px solid var(--ui-border, #e0e0e0);
      border-radius: 8px;
      margin-bottom: 6px;
      cursor: grab;
      user-select: none;
    }
    .row:active {
      cursor: grabbing;
    }
    .handle {
      color: var(--theredhead-on-surface-variant, #999);
      font-size: 1.1rem;
    }
    .row img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 6px;
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
    .log {
      margin: 16px 0 0;
      padding: 10px 14px;
      background: var(--theredhead-surface-variant, #f4f4f4);
      color: var(--theredhead-on-surface, #333);
      border-radius: 6px;
      font: 400 0.75rem/1.5 monospace;
    }

    :host-context(html.dark-theme) {
      .heading {
        color: #f2f6fb;
      }
      .row {
        background: #1e2128;
        border-color: #3a3f47;
      }
      .handle {
        color: #8b919a;
      }
      .info strong {
        color: #f2f6fb;
      }
      .meta {
        color: #8b919a;
      }
      .log {
        background: #1e2128;
        color: #d0d5dd;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .heading {
          color: #f2f6fb;
        }
        .row {
          background: #1e2128;
          border-color: #3a3f47;
        }
        .handle {
          color: #8b919a;
        }
        .info strong {
          color: #f2f6fb;
        }
        .meta {
          color: #8b919a;
        }
        .log {
          background: #1e2128;
          color: #d0d5dd;
        }
      }
    }
  `,
})
class RepeaterReorderDemo {
  public readonly ds = new ArrayDatasource(PHOTOS);
  public readonly lastEvent = signal<RepeaterReorderEvent | null>(null);

  public onReorder(event: RepeaterReorderEvent): void {
    this.lastEvent.set(event);
  }
}

@Component({
  selector: "ui-repeater-transfer-demo",
  standalone: true,
  imports: [UIRepeater],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="columns">
      <div class="column">
        <h3 class="heading">Available</h3>
        <ui-repeater
          #listA
          [datasource]="dsA"
          [reorderable]="true"
          [connectedTo]="[listB]"
          (reordered)="onReorder('A', $event)"
          (transferred)="onTransfer('A', $event)"
        >
          <ng-template let-photo>
            <div class="card">
              <img
                [src]="photo.url"
                [alt]="photo.name"
                loading="lazy"
                width="100"
                height="100"
              />
              <span class="label">{{ photo.name }}</span>
            </div>
          </ng-template>
        </ui-repeater>
      </div>
      <div class="column">
        <h3 class="heading">Selected</h3>
        <ui-repeater
          #listB
          [datasource]="dsB"
          [reorderable]="true"
          [connectedTo]="[listA]"
          (reordered)="onReorder('B', $event)"
          (transferred)="onTransfer('B', $event)"
        >
          <ng-template let-photo>
            <div class="card">
              <img
                [src]="photo.url"
                [alt]="photo.name"
                loading="lazy"
                width="100"
                height="100"
              />
              <span class="label">{{ photo.name }}</span>
            </div>
          </ng-template>
        </ui-repeater>
      </div>
    </div>
    @if (lastLog()) {
      <pre class="log">{{ lastLog() }}</pre>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .column {
      display: flex;
      flex-direction: column;
    }
    .heading {
      margin: 0 0 10px;
      font:
        600 0.95rem/1.4 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #222);
    }
    ui-repeater {
      display: block;
      min-height: 120px;
      padding: 8px;
      border: 2px dashed var(--ui-border, #ccc);
      border-radius: 10px;
      background: var(--theredhead-surface-variant, #fafafa);
    }
    .card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      margin-bottom: 6px;
      background: var(--theredhead-surface, #fff);
      border: 1px solid var(--ui-border, #e0e0e0);
      border-radius: 8px;
      cursor: grab;
      user-select: none;
    }
    .card:active {
      cursor: grabbing;
    }
    .card img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 6px;
      object-fit: cover;
    }
    .label {
      font:
        500 0.85rem/1.3 system-ui,
        sans-serif;
      color: var(--theredhead-on-surface, #333);
    }
    .log {
      margin: 16px 0 0;
      padding: 10px 14px;
      background: var(--theredhead-surface-variant, #f4f4f4);
      color: var(--theredhead-on-surface, #333);
      border-radius: 6px;
      font: 400 0.75rem/1.5 monospace;
    }

    :host-context(html.dark-theme) {
      .heading {
        color: #f2f6fb;
      }
      ui-repeater {
        background: #16191e;
        border-color: #3a3f47;
      }
      .card {
        background: #1e2128;
        border-color: #3a3f47;
      }
      .label {
        color: #d0d5dd;
      }
      .log {
        background: #1e2128;
        color: #d0d5dd;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .heading {
          color: #f2f6fb;
        }
        ui-repeater {
          background: #16191e;
          border-color: #3a3f47;
        }
        .card {
          background: #1e2128;
          border-color: #3a3f47;
        }
        .label {
          color: #d0d5dd;
        }
        .log {
          background: #1e2128;
          color: #d0d5dd;
        }
      }
    }
  `,
})
class RepeaterTransferDemo {
  public readonly dsA = new ArrayDatasource(PHOTOS.slice(0, 6));
  public readonly dsB = new ArrayDatasource(PHOTOS.slice(6, 9));
  public readonly lastLog = signal<string | null>(null);

  public onReorder(list: string, event: RepeaterReorderEvent): void {
    this.lastLog.set(
      `Reorder in ${list}: ${event.previousIndex} → ${event.currentIndex}`,
    );
  }

  public onTransfer(list: string, event: RepeaterTransferEvent<unknown>): void {
    this.lastLog.set(
      `Transfer → ${list}: "${(event.item as { name: string }).name}" at index ${event.currentIndex}`,
    );
  }
}

/* ── Storybook meta ───────────────────────────────────────────── */

const meta: Meta<UIRepeater> = {
  title: "@theredhead/UI Kit/Repeater",
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
        RepeaterReorderDemo,
        RepeaterTransferDemo,
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

/**
 * **Drag-and-drop reorder** — enable `[reorderable]="true"` to allow
 * users to drag items into a new order within a single repeater.
 * The `(reordered)` event emits the previous and current indices.
 */
export const Reorderable: Story = {
  render: () => ({
    template: `<ui-repeater-reorder-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-repeater
  [datasource]="ds"
  [reorderable]="true"
  (reordered)="onReorder($event)"
>
  <ng-template let-item let-i="index">
    <div class="row">
      <span class="handle">⠿</span>
      <strong>#{{ i + 1 }} {{ item.name }}</strong>
    </div>
  </ng-template>
</ui-repeater>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIRepeater, RepeaterReorderEvent } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-reorder-example',
  standalone: true,
  imports: [UIRepeater],
  templateUrl: './reorder-example.component.html',
})
export class ReorderExampleComponent {
  readonly ds = new ArrayDatasource([
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Bravo' },
    { id: 3, name: 'Charlie' },
  ]);

  onReorder(event: RepeaterReorderEvent): void {
    console.log('Moved from', event.previousIndex, 'to', event.currentIndex);
  }
}

// ── SCSS ──
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 6px;
  cursor: grab;
}
`,
      },
    },
  },
};

/**
 * **Transfer between lists** — connect two repeaters with `[connectedTo]`
 * to allow dragging items from one list to another.
 * Both `(reordered)` and `(transferred)` events are emitted as appropriate.
 */
export const TransferBetweenLists: Story = {
  render: () => ({
    template: `<ui-repeater-transfer-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="columns">
  <ui-repeater
    #listA
    [datasource]="dsAvailable"
    [reorderable]="true"
    [connectedTo]="[listB]"
    (transferred)="onTransfer($event)"
  >
    <ng-template let-item>
      <div class="card">{{ item.name }}</div>
    </ng-template>
  </ui-repeater>

  <ui-repeater
    #listB
    [datasource]="dsSelected"
    [reorderable]="true"
    [connectedTo]="[listA]"
    (transferred)="onTransfer($event)"
  >
    <ng-template let-item>
      <div class="card">{{ item.name }}</div>
    </ng-template>
  </ui-repeater>
</div>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRepeater, RepeaterTransferEvent } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-transfer-example',
  standalone: true,
  imports: [UIRepeater],
  templateUrl: './transfer-example.component.html',
})
export class TransferExampleComponent {
  readonly dsAvailable = new ArrayDatasource([
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
    { id: 3, name: 'Item C' },
  ]);
  readonly dsSelected = new ArrayDatasource([
    { id: 4, name: 'Item D' },
  ]);

  onTransfer(event: RepeaterTransferEvent<{ id: number; name: string }>): void {
    console.log('Transferred:', event.item.name, 'to index', event.currentIndex);
  }
}

// ── SCSS ──
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
ui-repeater {
  min-height: 120px;
  padding: 8px;
  border: 2px dashed #ccc;
  border-radius: 10px;
}
.card {
  padding: 8px 12px;
  margin-bottom: 6px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: grab;
}
`,
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, and template context.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
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
          '- **Drag-and-drop reorder** — enable `[reorderable]="true"` to let users drag items into a new order within a single repeater',
          "- **Cross-list transfer** — connect multiple repeaters with `[connectedTo]` to allow items to be dragged between them",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `ArrayDatasource<T>` | *(required)* | The data to iterate over |",
          "| `limit` | `number` | — | Maximum items to render |",
          "| `reorderable` | `boolean` | `false` | Enable drag-and-drop reordering |",
          "| `connectedTo` | `UIRepeater[]` | `[]` | Other repeaters to allow transfer to/from |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `reordered` | `{ previousIndex, currentIndex }` | Emitted when an item is reordered within this repeater |",
          "| `transferred` | `{ item, previousIndex, currentIndex }` | Emitted on the target when an item is transferred from another repeater |",
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
      source: { code: " " },
    },
  },
};
