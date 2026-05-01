import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICarousel } from "../../carousel.component";

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

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Carousel",
  component: DefaultStorySource,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  argTypes: scrollArgTypes,
  args: {
    fade: false,
    gap: 16,
    itemWidth: 280,
    showControls: true,
    showIndicators: false,
    wrap: false,
  } as Record<string, unknown>,
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
