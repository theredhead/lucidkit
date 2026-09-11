import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MapViewGeoJsonEditorStory } from "./geojson-editor.story";

const meta = {
  title: "@theredhead/UI Kit/Map View",
  component: MapViewGeoJsonEditorStory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Draw and edit multiple GeoJSON line and polygon features directly on the map. The feature collection stays in an external signal through two-way binding, segment clicks insert control points, and selected vertices can be removed with Delete or double-click.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [MapViewGeoJsonEditorStory],
    }),
  ],
} satisfies Meta<MapViewGeoJsonEditorStory>;

export default meta;
type Story = StoryObj<MapViewGeoJsonEditorStory>;

export const GeoJsonEditor: Story = {
  render: () => ({
    template: "<ui-map-view-geojson-editor-story />",
  }),
};
