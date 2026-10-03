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

import { SingleStorySource } from "./single.story";

interface SingleStoryArgs {
  showControls: boolean;
  showIndicators: boolean;
  wrap: boolean;
}

const meta = {
  title: "@theredhead/UI Kit/Carousel",
  component: SingleStorySource,
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
  decorators: [moduleMetadata({ imports: [SingleStorySource] })]
} satisfies Meta<SingleStoryArgs>;

export default meta;
type Story = StoryObj<SingleStoryArgs>;

export const Single: Story = {
  argTypes: carouselArgTypes,
  args: {
    showControls: true,
    showIndicators: true,
    wrap: true,
  },
  parameters: {
    docs: {}
  },
  render: (args) => ({
    props: args,
    template: `<ui-single-story-demo
      [showControls]="showControls"
      [showIndicators]="showIndicators"
      [wrap]="wrap"
    />`,
  })
};
