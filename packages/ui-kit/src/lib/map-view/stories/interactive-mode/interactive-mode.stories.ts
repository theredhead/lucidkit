import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MapViewInteractiveDemo } from "./interactive-mode.story";
import type { MapViewInteractionMode } from "../../map-view.model";

interface MapViewInteractiveStoryArgs {
  readonly width: string;
  readonly height: string;
  readonly ariaLabel: string;
  readonly interactionMode: MapViewInteractionMode;
}

const meta = {
  title: "@theredhead/UI Kit/Map View",
  component: MapViewInteractiveDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Interactive mode enables drag panning and wheel/keyboard zoom while emitting center and zoom changes.",
      },
    },
  },
  argTypes: {
    width: {
      control: "text",
      description: "CSS width of the map container.",
    },
    height: {
      control: "text",
      description: "CSS height of the map container.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the map.",
    },
    interactionMode: {
      control: "radio",
      options: ["interactive", "static"] satisfies MapViewInteractionMode[],
      description: "Map interaction behavior.",
    },
  },
  decorators: [moduleMetadata({ imports: [MapViewInteractiveDemo] })],
} satisfies Meta<MapViewInteractiveStoryArgs>;

export default meta;
type Story = StoryObj<MapViewInteractiveStoryArgs>;

export const InteractiveMode: Story = {
  args: {
    width: "100%",
    height: "560px",
    ariaLabel: "Interactive Europe map",
    interactionMode: "interactive",
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-map-view-interactive-demo
        [width]="width"
        [height]="height"
        [ariaLabel]="ariaLabel"
        [interactionMode]="interactionMode"
      />
    `,
  }),
};
