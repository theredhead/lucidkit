import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICarousel } from "../../carousel.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Carousel",
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
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UICarousel>;

export default meta;
type Story = StoryObj;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Strategy pattern** — swap between single, scroll, coverflow, or custom layouts\n" +
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
        "| `strategy` | `CarouselStrategy` | `ScrollCarouselStrategy` | Layout / animation strategy |\n" +
        "| `activeIndex` | `number` | `0` | Currently active item (model) |\n" +
        "| `showControls` | `boolean` | `true` | Show prev / next buttons |\n" +
        "| `showIndicators` | `boolean` | `true` | Show dot indicators |\n" +
        "| `wrap` | `boolean` | `false` | Endless mode — wraps first ↔ last |\n" +
        "| `ariaLabel` | `string` | `'Carousel'` | Accessible label |\n\n" +
        "### Strategies\n" +
        "| Strategy | Effect |\n" +
        "|----------|--------|\n" +
        "| `ScrollCarouselStrategy` | Horizontal slide, item-by-item — **default** |\n" +
        "| `SingleCarouselStrategy` | One visible item at a time, stretched to the carousel frame |\n" +
        "| `CoverflowCarouselStrategy` | 3D perspective fan (classic iPod / macOS) |\n\n" +
        "### Coverflow Options\n" +
        "| Option | Type | Default | Description |\n" +
        "|--------|------|---------|-------------|\n" +
        "| `peekOffset` | `number` | `42` | Distance from centre to first neighbour (px) |\n" +
        "| `stackGap` | `number` | `18` | Extra shift per item beyond first neighbour (px) |\n" +
        "| `rotateY` | `number` | `72` | Y-axis rotation for side items (°) |\n" +
        "| `sideScale` | `number` | `0.82` | Scale factor for side items |\n" +
        "| `depthOffset` | `number` | `80` | Z-axis push for side items (px) |\n" +
        "| `blur` | `boolean` | `false` | Progressive blur on non-active items |\n" +
        "| `fade` | `boolean` | `false` | Progressively fade non-active items |"
      }
    }
  },
  render: () => ({ template: " " })
};
