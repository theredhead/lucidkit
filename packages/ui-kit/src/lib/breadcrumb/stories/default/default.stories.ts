import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIBreadcrumb, type BreadcrumbVariant } from "../../breadcrumb.component";

import { BreadcrumbDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Breadcrumb",
  component: UIBreadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A navigation aid that shows the user’s current location within " +
          "a hierarchical structure.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["link", "button"] satisfies BreadcrumbVariant[],
      description: "Visual style: links or styled buttons.",
    },
    separator: {
      control: "text",
      description: "Separator character between crumbs (link variant).",
    },
    disabled: {
      control: "boolean",
      description: "Disables all breadcrumb items.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation landmark.",
    },
  },
  decorators: [moduleMetadata({ imports: [BreadcrumbDemo] })]
} satisfies Meta<UIBreadcrumb>;

export default meta;
type Story = StoryObj<UIBreadcrumb>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Custom separator** — default `/`, or pass any string (`›`, `|`, etc.)\n" +
        "- **Link variant** (default) — crumbs render as `<a>` anchors\n" +
        "- **Button variant** — crumbs render as styled buttons with chevron separators\n" +
        "- **Active item** — the last item (no `url`) renders as plain text\n\n" +
        "### Inputs\n" +
        "| Input | Type | Default | Description |\n" +
        "|-------|------|---------|-------------|\n" +
        "| `items` | `BreadcrumbItem[]` | *(required)* | Array of `{ label, url? }` |\n" +
        "| `variant` | `'link' \\| 'button'` | `'link'` | Visual style |\n" +
        "| `separator` | `string` | `'/'` | Separator between crumbs (link variant) |\n\n" +
        "### Output\n" +
        "| Output | Payload | Description |\n" +
        "|--------|---------|-------------|\n" +
        "| `itemClicked` | `BreadcrumbItem` | Emitted when a crumb is clicked |"
      }
    }
  },
  render: () => ({
      template: "<ui-breadcrumb-demo />",
    })
};
