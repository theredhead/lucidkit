import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MapViewBasicDemo } from "./basic.story";
import type { MapViewInteractionMode } from "../../map-view.model";

interface MapViewBasicStoryArgs {
  readonly zoom: number;
  readonly width: string | undefined;
  readonly height: string;
  readonly ariaLabel: string;
  readonly interactionMode: MapViewInteractionMode;
}

const meta = {
  title: "@theredhead/UI Kit/Map View",
  component: MapViewBasicDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "`UIMapView` is a lightweight map component that renders OpenStreetMap tiles centred on a given location with optional SVG overlays. It has **zero external dependencies** — all tile math and rendering uses native browser APIs.",
          'Set `interactionMode` to `"interactive"` to enable drag panning, wheel zooming, and keyboard controls.',
          "Use `drawMode` together with `[(geoJsonFeatureCollection)]` for multi-shape GeoJSON editing, or `[(geoJsonLine)]` / `[(geoJsonPolygon)]` for the single-geometry compatibility surface.",
          "",
          "## Key Features",
          "",
          "- **Tile rendering** — fetches and positions OpenStreetMap raster tiles based on `center` and `zoom`",
          "- **Markers** — drop pins with labels, custom colours, and optional custom SVG icons",
          "- **Polylines** — draw routes and paths with configurable colour, width, and dash patterns",
          "- **Polygons** — render filled regions with stroke and fill colours",
          "- **Highlight mode** — enable a glow effect on polylines and polygons with `highlighted: true`",
          "- **Accessible** — configurable `ariaLabel` for the map container",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `center` | `{ lat: number; lng: number }` | *(required)* | Geographic centre of the map |",
          "| `zoom` | `number` | `13` | Zoom level (1 = world, 18 = building) |",
          '| `height` | `string` | `"400px"` | CSS height of the map container |',
          '| `width` | `string` | `"100%"` | CSS width of the map container |',
          "| `markers` | `MapMarker[]` | `[]` | Pin markers with position, label, colour |",
          "| `polylines` | `MapPolyline[]` | `[]` | Line overlays (routes, paths) |",
          "| `polygons` | `MapPolygon[]` | `[]` | Filled region overlays |",
          '| `interactionMode` | `"static" | "interactive"` | `"static"` | Enables panning/zooming interactions when set to `"interactive"` |',
          '| `drawMode` | `"none" | "line" | "polygon"` | `"none"` | Enables drawing for the editable GeoJSON overlays |',
          "| `geoJsonFeatureCollection` | `FeatureCollection` | `null` | Two-way editable GeoJSON feature collection containing line and polygon features |",
          '| `ariaLabel` | `string` | `"Map"` | Accessible label |',
        ].join("\n"),
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
    interactionMode: {
      control: "radio",
      options: ["static", "interactive"] satisfies MapViewInteractionMode[],
      description: "Map interaction behavior.",
    },
  },
  decorators: [moduleMetadata({ imports: [MapViewBasicDemo] })],
} satisfies Meta<MapViewBasicStoryArgs>;

export default meta;
type Story = StoryObj<MapViewBasicStoryArgs>;

export const Basic: Story = {
  args: {
    zoom: 3,
    width: undefined,
    height: "500px",
    ariaLabel: "Map view",
    interactionMode: "static",
  },

  parameters: {
    docs: {},
  },

  render: (args) => ({
    props: args,
    template: `
      <ui-map-view-basic-demo
        [zoom]="zoom"
        [width]="width"
        [height]="height"
        [ariaLabel]="ariaLabel"
        [interactionMode]="interactionMode"
      />
    `,
  }),
};
