import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UICarousel } from "./carousel.component";
import { ScrollCarouselStrategy } from "./scroll-strategy";
import { CoverflowCarouselStrategy } from "./coverflow-strategy";

/* ── Shared slide data ── */

interface Album {
  readonly title: string;
  readonly artist: string;
  readonly color: string;
}

const ALBUMS: readonly Album[] = [
  { title: "Abbey Road", artist: "The Beatles", color: "#2d6a4f" },
  { title: "Rumours", artist: "Fleetwood Mac", color: "#6c3483" },
  { title: "Thriller", artist: "Michael Jackson", color: "#c0392b" },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    color: "#1a1a2e",
  },
  { title: "Back in Black", artist: "AC/DC", color: "#212121" },
  { title: "Led Zeppelin IV", artist: "Led Zeppelin", color: "#6e4b3a" },
  { title: "Hotel California", artist: "Eagles", color: "#d35400" },
];

/* ── Demo components ── */

@Component({
  selector: "ui-carousel-scroll-demo",
  standalone: true,
  imports: [UICarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .slide {
        width: 280px;
        height: 200px;
        border-radius: 0.75rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        font-family: system-ui, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .slide-title {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0;
      }
      .slide-artist {
        font-size: 0.8125rem;
        margin: 0.25rem 0 0;
        opacity: 0.8;
      }
    `,
  ],
  template: `
    <ui-carousel
      [items]="albums"
      [strategy]="strategy"
      [(activeIndex)]="active"
      ariaLabel="Album carousel (scroll)"
    >
      <ng-template let-album>
        <div class="slide" [style.background]="album.color">
          <p class="slide-title">{{ album.title }}</p>
          <p class="slide-artist">{{ album.artist }}</p>
        </div>
      </ng-template>
    </ui-carousel>
  `,
})
class CarouselScrollDemo {
  public readonly albums = ALBUMS;
  public readonly strategy = new ScrollCarouselStrategy();
  public readonly active = signal(0);
}

@Component({
  selector: "ui-carousel-coverflow-demo",
  standalone: true,
  imports: [UICarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem 0;
      }
      .cover {
        width: 240px;
        height: 240px;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        font-family: system-ui, sans-serif;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
      }
      .cover-title {
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
      }
      .cover-artist {
        font-size: 0.75rem;
        margin: 0.25rem 0 0;
        opacity: 0.8;
      }
    `,
  ],
  template: `
    <ui-carousel
      [items]="albums"
      [strategy]="strategy"
      [(activeIndex)]="active"
      ariaLabel="Album carousel (coverflow)"
    >
      <ng-template let-album>
        <div class="cover" [style.background]="album.color">
          <p class="cover-title">{{ album.title }}</p>
          <p class="cover-artist">{{ album.artist }}</p>
        </div>
      </ng-template>
    </ui-carousel>
  `,
})
class CarouselCoverflowDemo {
  public readonly albums = ALBUMS;
  public readonly strategy = new CoverflowCarouselStrategy();
  public readonly active = signal(3);
}

/* ── Meta ── */

const meta: Meta<UICarousel> = {
  title: "@theredhead/UI Kit/Carousel",
  component: UICarousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A generic carousel with pluggable layout strategies.\n\n" +
          "### Features\n" +
          "- **Strategy pattern** — swap between scroll and coverflow (or custom) layouts\n" +
          "- **Keyboard navigation** — arrow keys move between items\n" +
          "- **Dot indicators** — click to jump to any item\n" +
          "- **Prev / Next buttons** — optional navigation controls\n" +
          "- **Two-way binding** — `[(activeIndex)]` model signal\n" +
          "- **Content projection** — render any template per item via `<ng-template>`\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `items` | `T[]` | *(required)* | Data items to display |\n" +
          "| `strategy` | `CarouselStrategy` | `ScrollCarouselStrategy` | Layout / animation strategy |\n" +
          "| `activeIndex` | `number` | `0` | Currently active item (model) |\n" +
          "| `showControls` | `boolean` | `true` | Show prev / next buttons |\n" +
          "| `showIndicators` | `boolean` | `true` | Show dot indicators |\n" +
          "| `ariaLabel` | `string` | `'Carousel'` | Accessible label |\n\n" +
          "### Strategies\n" +
          "| Strategy | Effect |\n" +
          "|----------|--------|\n" +
          "| `ScrollCarouselStrategy` | Horizontal slide, item-by-item |\n" +
          "| `CoverflowCarouselStrategy` | 3D perspective fan (classic iPod / macOS) |",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CarouselScrollDemo, CarouselCoverflowDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UICarousel>;

/**
 * Default scroll-style carousel. Items slide left / right
 * with the active item centred and neighbours faded.
 */
export const Scroll: Story = {
  render: () => ({
    template: `<ui-carousel-scroll-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-carousel [items]="albums" [strategy]="strategy" [(activeIndex)]="active">
  <ng-template let-album>
    <div class="slide" [style.background]="album.color">
      <p>{{ album.title }}</p>
      <p>{{ album.artist }}</p>
    </div>
  </ng-template>
</ui-carousel>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICarousel, ScrollCarouselStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template: \\\`
    <ui-carousel [items]="albums" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-album>
        <div [style.background]="album.color">{{ album.title }}</div>
      </ng-template>
    </ui-carousel>
  \\\`,
})
export class ExampleComponent {
  readonly albums = [
    { title: 'Abbey Road', color: '#2d6a4f' },
    { title: 'Rumours', color: '#6c3483' },
  ];
  readonly strategy = new ScrollCarouselStrategy();
  readonly active = signal(0);
}

// ── SCSS ──
/* No custom styles needed — carousel tokens handle theming. */
`,
      },
    },
  },
};

/**
 * Classic coverflow effect inspired by macOS and iPod Cover Flow.
 * The active item sits front-and-centre; neighbours fan out to
 * either side with 3D perspective rotation, scale reduction,
 * and a gentle blur.
 */
export const Coverflow: Story = {
  render: () => ({
    template: `<ui-carousel-coverflow-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-carousel [items]="albums" [strategy]="strategy" [(activeIndex)]="active">
  <ng-template let-album>
    <div class="cover" [style.background]="album.color">
      <p>{{ album.title }}</p>
    </div>
  </ng-template>
</ui-carousel>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICarousel, CoverflowCarouselStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template: \\\`
    <ui-carousel [items]="albums" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-album>
        <div [style.background]="album.color">{{ album.title }}</div>
      </ng-template>
    </ui-carousel>
  \\\`,
})
export class ExampleComponent {
  readonly albums = [
    { title: 'Abbey Road', color: '#2d6a4f' },
    { title: 'Rumours', color: '#6c3483' },
    { title: 'Thriller', color: '#c0392b' },
  ];
  readonly strategy = new CoverflowCarouselStrategy();
  readonly active = signal(1);
}

// ── SCSS ──
/* No custom styles needed — carousel tokens handle theming. */
`,
      },
    },
  },
};
