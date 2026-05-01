import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextViewStrategy } from "../../rich-text-view.component";

import { DataDetectorsPlaygroundStorySource } from "./data-detectors-playground.story";

const strategies: RichTextViewStrategy[] = ["auto", "html", "markdown"];

const meta = {
  title: "@theredhead/UI Kit/Rich Text View",
  component: DataDetectorsPlaygroundStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        story:
          "Live playground combining `UIRichTextEditor`, `UIRichTextView`, and a horizontal `UISplitContainer` so detector behavior can be edited and previewed side by side.",
      },
    },
  },
  argTypes: {
    strategy: {
      control: "select",
      options: strategies satisfies RichTextViewStrategy[],
      description: "How the preview interprets the current rich text content.",
    },
    initialContent: {
      control: "text",
      description:
        "Initial content seeded into the editor. Changing it resets the playground content.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label applied to the preview renderer.",
    },
    dividerWidth: {
      control: { type: "number", min: 4, max: 24, step: 1 },
      description: "Width of the draggable divider between editor and preview.",
    },
    phoneNumbers: {
      control: "boolean",
      description: "Enable the built-in phone number detector.",
    },
    urls: {
      control: "boolean",
      description: "Enable the built-in URL detector.",
    },
    emails: {
      control: "boolean",
      description: "Enable the built-in email detector.",
    },
    emoji: {
      control: "boolean",
      description: "Enable the built-in plaintext emoticon detector.",
    },
    editorPlaceholder: {
      control: "text",
      description: "Placeholder shown when the editor content is empty.",
    },
  },
  decorators: [
    moduleMetadata({ imports: [DataDetectorsPlaygroundStorySource] }),
  ],
} satisfies Meta<DataDetectorsPlaygroundStorySource>;

export default meta;
type Story = StoryObj<DataDetectorsPlaygroundStorySource>;

export const DataDetectorsPlayground: Story = {
  name: "Data Detectors Playground",
  args: {
    strategy: "html",
    ariaLabel: "Rich text preview with data detectors",
    editorPlaceholder: "Type or paste content to test detectors…",
    dividerWidth: 10,
    initialContent: `<h2>Detector playground</h2>
<p>Email ada@example.com or support@theredhead.dev.</p>
<p>Visit https://theredhead.dev/docs or call +1 (555) 123-4567.</p>
  <p>Plaintext emoticons convert too :-) ;-) :D &lt;3</p>`,
    phoneNumbers: true,
    urls: true,
    emails: true,
    emoji: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-data-detectors-playground-story-demo
        [ariaLabel]="ariaLabel"
        [dividerWidth]="dividerWidth"
        [editorPlaceholder]="editorPlaceholder"
        [emails]="emails"
        [emoji]="emoji"
        [initialContent]="initialContent"
        [phoneNumbers]="phoneNumbers"
        [strategy]="strategy"
        [urls]="urls"
      />
    `,
  }),
};
