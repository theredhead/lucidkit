import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  signal,
} from "@angular/core";

import { UICarousel } from "./carousel.component";
import { ScrollCarouselStrategy } from "./scroll-strategy";
import { CoverflowCarouselStrategy } from "./coverflow-strategy";

/* ── Shared slide data (picsum.photos — same service as repeater) ── */

interface Slide {
  readonly id: number;
  readonly name: string;
  readonly url: string;
}

const SLIDE_NAMES = [
  "Whiskers",
  "Mittens",
  "Shadow",
  "Pumpkin",
  "Luna",
  "Simba",
  "Mochi",
  "Cleo",
  "Felix",
  "Nala",
  "Ginger",
  "Oreo",
  "Pepper",
  "Ziggy",
  "Willow",
  "Jasper",
  "Coco",
  "Biscuit",
  "Maple",
  "Hazel",
  "Storm",
  "Dusty",
  "Clover",
  "Sage",
  "Indie",
];

function buildSlides(count = 7, width = 280, height = 200): readonly Slide[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: SLIDE_NAMES[i % SLIDE_NAMES.length],
    url: `https://picsum.photos/seed/carousel${i + 1}/${width}/${height}`,
  }));
}

const SCROLL_SLIDES = buildSlides(50, 280, 200);
const COVER_SLIDES = buildSlides(50, 240, 240);
const DENSE_SLIDES = buildSlides(50, 180, 180);

/* ── Interactive demo components ── */

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
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .slide-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem 0.75rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        color: #fff;
        font:
          600 0.875rem/1.4 system-ui,
          sans-serif;
        margin: 0;
      }
    `,
  ],
  template: `
    <ui-carousel
      [items]="slides"
      [strategy]="strategy()"
      [showControls]="showControls()"
      [showIndicators]="showIndicators()"
      [wrap]="wrap()"
      [(activeIndex)]="active"
      ariaLabel="Image carousel (scroll)"
    >
      <ng-template let-slide>
        <div class="slide">
          <img [src]="slide.url" [alt]="slide.name" loading="lazy" />
          <p class="slide-caption">{{ slide.name }}</p>
        </div>
      </ng-template>
    </ui-carousel>
  `,
})
class CarouselScrollDemo {
  public readonly gap = input(16);
  public readonly itemWidth = input(280);
  public readonly fade = input(false);
  public readonly showControls = input(true);
  public readonly showIndicators = input(true);
  public readonly wrap = input(false);

  public readonly slides = SCROLL_SLIDES;
  public readonly active = signal(0);

  protected readonly strategy = computed(
    () =>
      new ScrollCarouselStrategy({
        gap: this.gap(),
        itemWidth: this.itemWidth(),
        fade: this.fade(),
      }),
  );
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
        overflow: hidden;
        position: relative;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
      }
      .cover img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cover-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem 0.75rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
        color: #fff;
        font:
          700 0.875rem/1.4 system-ui,
          sans-serif;
        margin: 0;
        text-align: center;
      }
    `,
  ],
  template: `
    <ui-carousel
      [items]="slides"
      [strategy]="strategy()"
      [showControls]="showControls()"
      [showIndicators]="showIndicators()"
      [wrap]="wrap()"
      [(activeIndex)]="active"
      ariaLabel="Image carousel (coverflow)"
    >
      <ng-template let-slide>
        <div class="cover">
          <img [src]="slide.url" [alt]="slide.name" loading="lazy" />
          <p class="cover-caption">{{ slide.name }}</p>
        </div>
      </ng-template>
    </ui-carousel>
  `,
})
class CarouselCoverflowDemo {
  public readonly peekOffset = input(58);
  public readonly stackGap = input(25);
  public readonly rotateY = input(70);
  public readonly sideScale = input(0.85);
  public readonly depthOffset = input(100);
  public readonly blur = input(true);
  public readonly fade = input(true);
  public readonly showControls = input(true);
  public readonly showIndicators = input(true);
  public readonly wrap = input(false);

  public readonly slides = COVER_SLIDES;
  public readonly active = signal(25);

  protected readonly strategy = computed(
    () =>
      new CoverflowCarouselStrategy({
        peekOffset: this.peekOffset(),
        stackGap: this.stackGap(),
        rotateY: this.rotateY(),
        sideScale: this.sideScale(),
        depthOffset: this.depthOffset(),
        blur: this.blur(),
        fade: this.fade(),
      }),
  );
}

@Component({
  selector: "ui-carousel-dense-coverflow-demo",
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
        width: 180px;
        height: 180px;
        border-radius: 0.375rem;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }
      .cover img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cover-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.375rem 0.5rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: #fff;
        font:
          600 0.75rem/1.3 system-ui,
          sans-serif;
        margin: 0;
        text-align: center;
      }
    `,
  ],
  template: `
    <ui-carousel
      [items]="slides"
      [strategy]="strategy()"
      [showControls]="showControls()"
      [showIndicators]="showIndicators()"
      [wrap]="wrap()"
      [(activeIndex)]="active"
      ariaLabel="Dense coverflow carousel"
    >
      <ng-template let-slide>
        <div class="cover">
          <img [src]="slide.url" [alt]="slide.name" loading="lazy" />
          <p class="cover-caption">{{ slide.name }}</p>
        </div>
      </ng-template>
    </ui-carousel>
  `,
})
class CarouselDenseCoverflowDemo {
  public readonly peekOffset = input(42);
  public readonly stackGap = input(18);
  public readonly rotateY = input(72);
  public readonly sideScale = input(0.82);
  public readonly depthOffset = input(80);
  public readonly blur = input(false);
  public readonly fade = input(false);
  public readonly showControls = input(true);
  public readonly showIndicators = input(false);
  public readonly wrap = input(true);

  public readonly slides = DENSE_SLIDES;
  public readonly active = signal(25);

  protected readonly strategy = computed(
    () =>
      new CoverflowCarouselStrategy({
        peekOffset: this.peekOffset(),
        stackGap: this.stackGap(),
        rotateY: this.rotateY(),
        sideScale: this.sideScale(),
        depthOffset: this.depthOffset(),
        blur: this.blur(),
        fade: this.fade(),
      }),
  );
}

/* ── Shared argTypes ── */

const carouselArgTypes = {
  showControls: {
    control: { type: "boolean" as const },
    description: "Show prev / next navigation buttons.",
  },
  showIndicators: {
    control: { type: "boolean" as const },
    description: "Show dot indicators below the carousel.",
  },
  wrap: {
    control: { type: "boolean" as const },
    description: "Endless mode — continuous wrap first ↔ last.",
  },
};

const scrollArgTypes = {
  ...carouselArgTypes,
  gap: {
    control: { type: "range" as const, min: 0, max: 60, step: 2 },
    description: "Gap between items (px).",
  },
  itemWidth: {
    control: { type: "range" as const, min: 120, max: 500, step: 10 },
    description: "Width of each item (px).",
  },
  fade: {
    control: { type: "boolean" as const },
    description: "Progressively fade non-active items.",
  },
};

const coverflowArgTypes = {
  ...carouselArgTypes,
  peekOffset: {
    control: { type: "range" as const, min: 10, max: 200, step: 2 },
    description: "Distance from centre to first neighbour (px).",
  },
  stackGap: {
    control: { type: "range" as const, min: 0, max: 80, step: 1 },
    description: "Extra shift per item beyond first neighbour (px).",
  },
  rotateY: {
    control: { type: "range" as const, min: 0, max: 90, step: 1 },
    description: "Y-axis rotation for side items (°).",
  },
  sideScale: {
    control: { type: "range" as const, min: 0.3, max: 1, step: 0.01 },
    description: "Scale factor for side items.",
  },
  depthOffset: {
    control: { type: "range" as const, min: 0, max: 400, step: 5 },
    description: "Z-axis push for side items (px).",
  },
  blur: {
    control: { type: "boolean" as const },
    description: "Progressive blur on non-active items.",
  },
  fade: {
    control: { type: "boolean" as const },
    description: "Progressively fade non-active items.",
  },
};

/* ── Meta ── */

const meta: Meta<UICarousel> = {
  title: "@Theredhead/UI Kit/Carousel",
  component: UICarousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A generic carousel with pluggable layout strategies. " +
          "Navigate with arrow keys, mouse wheel, click, or the prev / next buttons. " +
          "Use the **Controls** panel below each story to experiment.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CarouselScrollDemo,
        CarouselCoverflowDemo,
        CarouselDenseCoverflowDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * Default coverflow carousel with 50 items, tight spacing,
 * endless wrap, and no blur. This is the component's default
 * configuration — no strategy or options needed.
 *
 * Use the **Controls** panel to experiment — try toggling
 * blur on, increasing peekOffset, or disabling wrap.
 */
export const Default: Story = {
  argTypes: coverflowArgTypes,
  args: {
    peekOffset: 42,
    stackGap: 18,
    rotateY: 72,
    sideScale: 0.82,
    depthOffset: 80,
    blur: false,
    fade: false,
    showControls: true,
    showIndicators: false,
    wrap: true,
  } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <ui-carousel-dense-coverflow-demo
        [peekOffset]="peekOffset"
        [stackGap]="stackGap"
        [rotateY]="rotateY"
        [sideScale]="sideScale"
        [depthOffset]="depthOffset"
        [blur]="blur"
        [fade]="fade"
        [showControls]="showControls"
        [showIndicators]="showIndicators"
        [wrap]="wrap"
      />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-carousel
  [items]="photos"
  [showIndicators]="false"
  [wrap]="true"
  [(activeIndex)]="active"
>
  <ng-template let-photo>
    <img [src]="photo.url" [alt]="photo.name" />
  </ng-template>
</ui-carousel>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICarousel } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template: \\\`
    <ui-carousel
      [items]="photos"
      [showIndicators]="false"
      [wrap]="true"
      [(activeIndex)]="active"
    >
      <ng-template let-photo>
        <img [src]="photo.url" [alt]="photo.name" />
      </ng-template>
    </ui-carousel>
  \\\`,
})
export class ExampleComponent {
  readonly photos = Array.from({ length: 50 }, (_, i) => ({
    name: 'Photo ' + (i + 1),
    url: 'https://picsum.photos/seed/carousel' + (i + 1) + '/180/180',
  }));
  readonly active = signal(25);
}

// ── SCSS ──
/* No custom styles needed — carousel tokens handle theming. */
`,
      },
    },
  },
};

/**
 * Coverflow with wider spacing and blur enabled.
 * Use this preset to see how the strategy options affect
 * the visual spread and depth of the fan.
 *
 * Use the **Controls** panel to fine-tune every coverflow option
 * in real time.
 */
export const Coverflow: Story = {
  argTypes: coverflowArgTypes,
  args: {
    peekOffset: 58,
    stackGap: 25,
    rotateY: 70,
    sideScale: 0.85,
    depthOffset: 100,
    blur: true,
    fade: true,
    showControls: true,
    showIndicators: false,
    wrap: false,
  } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <ui-carousel-coverflow-demo
        [peekOffset]="peekOffset"
        [stackGap]="stackGap"
        [rotateY]="rotateY"
        [sideScale]="sideScale"
        [depthOffset]="depthOffset"
        [blur]="blur"
        [fade]="fade"
        [showControls]="showControls"
        [showIndicators]="showIndicators"
        [wrap]="wrap"
      />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
  <ng-template let-photo>
    <div class="cover">
      <img [src]="photo.url" [alt]="photo.name" />
      <p class="caption">{{ photo.name }}</p>
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
    <ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-photo>
        <img [src]="photo.url" [alt]="photo.name" />
      </ng-template>
    </ui-carousel>
  \\\`,
})
export class ExampleComponent {
  readonly photos = [
    { name: 'Whiskers', url: 'https://picsum.photos/seed/carousel1/240/240' },
    { name: 'Mittens',  url: 'https://picsum.photos/seed/carousel2/240/240' },
    { name: 'Shadow',   url: 'https://picsum.photos/seed/carousel3/240/240' },
  ];
  readonly strategy = new CoverflowCarouselStrategy({
    peekOffset: 58,
    stackGap: 25,
    rotateY: 70,
    sideScale: 0.85,
    depthOffset: 100,
    blur: true,
  });
  readonly active = signal(1);
}

// ── SCSS ──
/* No custom styles needed — carousel tokens handle theming. */
`,
      },
    },
  },
};

/**
 * Horizontal scroll strategy. Items slide left / right
 * with the active item centred and neighbours faded.
 *
 * Use the **Controls** panel to adjust gap, item width,
 * and toggle navigation elements.
 */
export const Scroll: Story = {
  argTypes: scrollArgTypes,
  args: {
    gap: 16,
    itemWidth: 280,
    fade: false,
    showControls: true,
    showIndicators: false,
    wrap: false,
  } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <ui-carousel-scroll-demo
        [gap]="gap"
        [itemWidth]="itemWidth"
        [fade]="fade"
        [showControls]="showControls"
        [showIndicators]="showIndicators"
        [wrap]="wrap"
      />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
  <ng-template let-photo>
    <div class="slide">
      <img [src]="photo.url" [alt]="photo.name" />
      <p class="caption">{{ photo.name }}</p>
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
    <ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-photo>
        <img [src]="photo.url" [alt]="photo.name" />
      </ng-template>
    </ui-carousel>
  \\\`,
})
export class ExampleComponent {
  readonly photos = [
    { name: 'Whiskers', url: 'https://picsum.photos/seed/carousel1/280/200' },
    { name: 'Mittens',  url: 'https://picsum.photos/seed/carousel2/280/200' },
    { name: 'Shadow',   url: 'https://picsum.photos/seed/carousel3/280/200' },
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
 * _API Reference_ — features, inputs, strategies, and coverflow options.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Strategy pattern** — swap between scroll and coverflow (or custom) layouts\n" +
          "- **Keyboard navigation** — arrow keys move between items\n" +
          "- **Wheel / trackpad** — horizontal scroll navigates items\n" +
          "- **Click-to-select** — click any item to centre it\n" +
          "- **Dot indicators** — click to jump to any item\n" +
          "- **Prev / Next buttons** — optional navigation controls\n" +
          "- **Two-way binding** — `[(activeIndex)]` model signal\n" +
          "- **Content projection** — render any template per item via `<ng-template>`\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `items` | `T[]` | *(required)* | Data items to display |\n" +
          "| `strategy` | `CarouselStrategy` | `CoverflowCarouselStrategy` | Layout / animation strategy |\n" +
          "| `activeIndex` | `number` | `0` | Currently active item (model) |\n" +
          "| `showControls` | `boolean` | `true` | Show prev / next buttons |\n" +
          "| `showIndicators` | `boolean` | `true` | Show dot indicators |\n" +
          "| `wrap` | `boolean` | `false` | Endless mode — wraps first ↔ last |\n" +
          "| `ariaLabel` | `string` | `'Carousel'` | Accessible label |\n\n" +
          "### Strategies\n" +
          "| Strategy | Effect |\n" +
          "|----------|--------|\n" +
          "| `CoverflowCarouselStrategy` | 3D perspective fan (classic iPod / macOS) — **default** |\n" +
          "| `ScrollCarouselStrategy` | Horizontal slide, item-by-item |\n\n" +
          "### Coverflow Options\n" +
          "| Option | Type | Default | Description |\n" +
          "|--------|------|---------|-------------|\n" +
          "| `peekOffset` | `number` | `42` | Distance from centre to first neighbour (px) |\n" +
          "| `stackGap` | `number` | `18` | Extra shift per item beyond first neighbour (px) |\n" +
          "| `rotateY` | `number` | `72` | Y-axis rotation for side items (°) |\n" +
          "| `sideScale` | `number` | `0.82` | Scale factor for side items |\n" +
          "| `depthOffset` | `number` | `80` | Z-axis push for side items (px) |\n" +
          "| `blur` | `boolean` | `false` | Progressive blur on non-active items |\n" +
          "| `fade` | `boolean` | `false` | Progressively fade non-active items |",
      },
      source: { code: " " },
    },
  },
};
