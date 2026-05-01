import { type Meta } from "@storybook/angular";

import { UICarousel } from "../../carousel.component";

const meta = {
  title: "@theredhead/UI Kit/Carousel",
  component: UICarousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A generic carousel with pluggable layout strategies.",
          "Navigate with arrow keys, mouse wheel, click, or the prev / next buttons.",
          "Use the **Controls** panel below each story to experiment.",
          "",
          "### Features",
          "- **Strategy pattern** — swap between single, scroll, coverflow, or custom layouts",
          "- **Keyboard navigation** — arrow keys move between items",
          "- **Wheel / trackpad** — horizontal scroll navigates items",
          "- **Click-to-select** — click any item to centre it",
          "- **Dot indicators** — click to jump to any item",
          "- **Prev / Next buttons** — optional navigation controls",
          "- **Two-way binding** — `[(activeIndex)]` model signal",
          "- **Content projection** — render any template per item via `<ng-template>`",
          "",
          "### Inputs",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `items` | `T[]` | *(required)* | Data items to display |",
          "| `strategy` | `CarouselStrategy` | `ScrollCarouselStrategy` | Layout / animation strategy |",
          "| `activeIndex` | `number` | `0` | Currently active item (model) |",
          "| `showControls` | `boolean` | `true` | Show prev / next buttons |",
          "| `showIndicators` | `boolean` | `true` | Show dot indicators |",
          "| `wrap` | `boolean` | `false` | Endless mode — wraps first ↔ last |",
          "| `ariaLabel` | `string` | `'Carousel'` | Accessible label |",
          "",
          "### Strategies",
          "| Strategy | Effect |",
          "|----------|--------|",
          "| `ScrollCarouselStrategy` | Horizontal slide, item-by-item — **default** |",
          "| `SingleCarouselStrategy` | One visible item at a time, stretched to the carousel frame |",
          "| `CoverflowCarouselStrategy` | 3D perspective fan (classic iPod / macOS) |",
          "",
          "### Coverflow Options",
          "| Option | Type | Default | Description |",
          "|--------|------|---------|-------------|",
          "| `peekOffset` | `number` | `42` | Distance from centre to first neighbour (px) |",
          "| `stackGap` | `number` | `18` | Extra shift per item beyond first neighbour (px) |",
          "| `rotateY` | `number` | `72` | Y-axis rotation for side items (°) |",
          "| `sideScale` | `number` | `0.82` | Scale factor for side items |",
          "| `depthOffset` | `number` | `80` | Z-axis push for side items (px) |",
          "| `blur` | `boolean` | `false` | Progressive blur on non-active items |",
          "| `fade` | `boolean` | `false` | Progressively fade non-active items |",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
