import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MapViewRouteDemo } from "./route-polyline.story";

const meta = {
  title: "@theredhead/UI Kit/Map View",
  component: MapViewRouteDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`UIMapView` is a lightweight static map component that renders OpenStreetMap tiles centred on a given location with optional SVG overlays. It has **zero external dependencies** — all tile math and rendering uses native browser APIs.",
      },
    },
  },
  argTypes: {
    zoom: {
      control: { type: "range", min: 1, max: 19, step: 1 },
      description: "Zoom level (1–19).",
    },
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
  },
  decorators: [moduleMetadata({ imports: [MapViewRouteDemo] })],
} satisfies Meta<MapViewRouteDemo>;

export default meta;
type Story = StoryObj<MapViewRouteDemo>;

export const RoutePolyline: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-map-view-route-demo />",
  }),
};
