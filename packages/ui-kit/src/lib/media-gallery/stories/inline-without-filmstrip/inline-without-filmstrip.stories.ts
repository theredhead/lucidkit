import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { InlineWithoutFilmstripStorySource } from "./inline-without-filmstrip.story";
import { mediaGalleryStoryArgs, mediaGalleryStoryArgTypes } from "../media-gallery-story-controls";

const meta = {
    title: "@theredhead/UI Kit/Media Gallery",
    component: InlineWithoutFilmstripStorySource,
    tags: ["autodocs"],
    argTypes: mediaGalleryStoryArgTypes,
    decorators: [moduleMetadata({ imports: [InlineWithoutFilmstripStorySource] })],
    parameters: {
        layout: "fullscreen",
        docs: { description: { story: "Constrained inline mode with showFilmstrip disabled." } },
    },
} satisfies Meta<InlineWithoutFilmstripStorySource>;

export default meta;
type Story = StoryObj<InlineWithoutFilmstripStorySource>;

export const InlineWithoutFilmstrip: Story = {
    args: mediaGalleryStoryArgs(false),
    render: (args) => ({
        props: args,
        template: `<ui-media-gallery-inline-without-filmstrip-story
            [idleDelay]="idleDelay"
            [showFilmstrip]="showFilmstrip"
        />`,
    }),
};
