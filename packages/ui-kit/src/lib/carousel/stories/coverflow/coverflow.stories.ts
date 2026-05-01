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

import { CoverflowStorySource } from "./coverflow.story";

const meta = {
  title: "@theredhead/UI Kit/Carousel",
  component: CoverflowStorySource,
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
  decorators: [moduleMetadata({ imports: [CoverflowStorySource] })]
} satisfies Meta<CoverflowStorySource>;

export default meta;
type Story = StoryObj;

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
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-coverflow-story-demo />",
    })
};
