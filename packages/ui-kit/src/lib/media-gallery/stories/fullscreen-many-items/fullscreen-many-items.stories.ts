import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FullscreenManyItemsStorySource } from "./fullscreen-many-items.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: FullscreenManyItemsStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [FullscreenManyItemsStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Fullscreen mode with a filmstrip that exceeds the viewport width." } },
    },
} satisfies Meta<FullscreenManyItemsStorySource>;

export default meta;
type Story = StoryObj<FullscreenManyItemsStorySource>;

export const FullscreenManyItems: Story = {
    args: mediaGalleryStoryArgs(true),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-fullscreen-many-items-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
