import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Blocks/Common Dialogs",
  component: DefaultStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`CommonDialogService` provides a set of standard application dialogs:",
          "",
          "- **Alert** — simple informational message with a dismiss button",
          "- **Confirm** — explicit decisions for actions such as deleting, archiving, or discarding changes",
          "- **Prompt** — text input with a named submit action and a named alternative",
          "- **Open File** — file browser for selecting file(s)",
          "- **Save File** — file browser with a file-name input",
          "- **About** — application information with logo, version, credits",
          "",
          "All methods are `async` and return `Promise`-based results.",
          "The service uses `ModalService` from `@theredhead/lucid-kit` internally.",
        ].join("\n"),
      },
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-default-story-demo />",
  }),
};
