import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FullscreenFewItemsStorySource } from "./fullscreen-few-items.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: FullscreenFewItemsStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [FullscreenFewItemsStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Fullscreen mode with a short mixed-media collection." } },
    },
} satisfies Meta<FullscreenFewItemsStorySource>;

export default meta;
type Story = StoryObj<FullscreenFewItemsStorySource>;

export const FullscreenFewItems: Story = {
    args: mediaGalleryStoryArgs(true),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-fullscreen-few-items-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
