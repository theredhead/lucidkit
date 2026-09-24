import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FullscreenWithoutFilmstripStorySource } from "./fullscreen-without-filmstrip.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: FullscreenWithoutFilmstripStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [FullscreenWithoutFilmstripStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Fullscreen mode with showFilmstrip disabled." } },
    },
} satisfies Meta<FullscreenWithoutFilmstripStorySource>;

export default meta;
type Story = StoryObj<FullscreenWithoutFilmstripStorySource>;

export const FullscreenWithoutFilmstrip: Story = {
    args: mediaGalleryStoryArgs(false),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-fullscreen-without-filmstrip-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
