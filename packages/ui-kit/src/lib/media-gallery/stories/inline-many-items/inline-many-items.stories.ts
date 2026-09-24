import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { InlineManyItemsStorySource } from "./inline-many-items.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: InlineManyItemsStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [InlineManyItemsStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Constrained inline mode with a filmstrip wider than its viewport." } },
    },
} satisfies Meta<InlineManyItemsStorySource>;

export default meta;
type Story = StoryObj<InlineManyItemsStorySource>;

export const InlineManyItems: Story = {
    args: mediaGalleryStoryArgs(true),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-inline-many-items-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
            [transition]="transition"
        />`,
    }),
};
