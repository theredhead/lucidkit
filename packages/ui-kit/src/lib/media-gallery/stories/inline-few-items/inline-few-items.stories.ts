import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { InlineFewItemsStorySource } from "./inline-few-items.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: InlineFewItemsStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [InlineFewItemsStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Constrained inline mode with the default filmstrip and four items." } },
    },
} satisfies Meta<InlineFewItemsStorySource>;

export default meta;
type Story = StoryObj<InlineFewItemsStorySource>;

export const InlineFewItems: Story = {
    args: mediaGalleryStoryArgs(true),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-inline-few-items-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
