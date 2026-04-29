import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIMapView } from "../../map-view.component";
import type { MapLatLng } from "../../map-view.model";

// ── Demo data ─────────────────────────────────────────────────────────

const AMSTERDAM: MapLatLng = { lat: 52.3676, lng: 4.9041 };

// ── Story components ──────────────────────────────────────────────────

@Component({
  selector: "ui-map-view-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMapView],
  template: ` <ui-map-view [center]="center" [zoom]="13" height="500px" /> `,
})
class MapViewBasicDemo {
  readonly center = AMSTERDAM;
}

import { MapViewMarkersDemo } from "./with-markers.story";

const meta = {
  title: "@theredhead/UI Kit/Map View",
  component: MapViewBasicDemo,
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
  decorators: [moduleMetadata({ imports: [MapViewMarkersDemo] })]
} satisfies Meta<object>;

export default meta;
type Story = StoryObj<object>;

export const WithMarkers: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-map-view-markers-demo />",
    })
};
