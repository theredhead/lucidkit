import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MixedMediaStorySource } from "./mixed-media.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: MixedMediaStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [MixedMediaStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Fullscreen mixed-media viewer for UIImage and UIMediaPlayer hosts. " +
                    "Items with the same gallery attribute value share a collection; " +
                    "plain gallery attributes share the unnamed collection.",
            },
        },
    },
} satisfies Meta<MixedMediaStorySource>;

export default meta;
type Story = StoryObj<MixedMediaStorySource>;

export const MixedMedia: Story = {
    args: mediaGalleryStoryArgs(true),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-mixed-media-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
