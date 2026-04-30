import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { IconViewDemo } from "./icon-view.story";

const meta = {
  title: "@theredhead/UI Blocks/File Browser",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIFileBrowser` is a two-panel file explorer composing `UITreeView`, `UIBreadcrumb`, and a contents list.",
          "",
          "## Features",
          "",
          "- **Tree sidebar** \u2014 shows the folder hierarchy with expand/collapse.",
          "- **Contents panel** \u2014 displays files and sub-folders in the selected directory.",
          "- **Breadcrumb bar** \u2014 shows the current path with click-to-navigate.",
          "- **Datasource-driven** \u2014 implement `FileBrowserDatasource` to connect any storage backend.",
          "- **Custom templates** \u2014 project an `#entryTemplate` to customise how entries are rendered.",
          "- **File activation** \u2014 double-click or Enter on a file emits `fileActivated`.",
          "- **Accessible** \u2014 full keyboard navigation, ARIA roles.",
          "",
          "## CSS Custom Properties",
          "",
          "`--fb-bg`, `--fb-text`, `--fb-border`, `--fb-sidebar-bg`, `--fb-sidebar-width`, `--fb-entry-selected`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    showSidebar: {
      control: "boolean",
      description: "Show the tree sidebar.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the file browser.",
    },
  },
  decorators: [moduleMetadata({ imports: [IconViewDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const IconView: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-file-browser-icon-view-demo />",
    })
};
