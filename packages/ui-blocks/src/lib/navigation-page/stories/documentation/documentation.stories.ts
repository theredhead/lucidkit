import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UINavigationPage } from "../../navigation-page.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Blocks/Navigation Page",
  component: UINavigationPage,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A full-page navigation layout that combines a sidebar " +
          "navigation, an automatic breadcrumb trail, and a content area.",
      },
    },
  },
  argTypes: {
    drawerPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Side from which the navigation drawer slides in.",
    },
    drawerWidth: {
      control: "select",
      options: ["narrow", "wide", "full"],
      description: "Width preset for the navigation drawer.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation page.",
    },
  },
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UINavigationPage>;

export default meta;
type Story = StoryObj<UINavigationPage>;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- Pinned sidebar (desktop) or drawer-based sidebar (mobile)\n" +
        "- Automatic breadcrumb trail with group hierarchy\n" +
        "- Collapsible sidebar groups via tree nodes with children\n" +
        "- Icon and badge support on navigation items\n" +
        "- Two-way binding for active page and drawer state\n" +
        "- Projected content template with node context\n" +
        "- `routesToNavigation()` utility for Angular Router integration\n\n" +
        "### Data sources\n" +
        "| Input | Type | Default | Purpose |\n" +
        "|-------|------|---------|--------|\n" +
        "| `datasource` | `ITreeDatasource<NavigationNodeData>` | – | Dynamic tree data |\n" +
        "| `items` | `NavigationNode[]` | `[]` | Static in-memory tree |\n\n" +
        "When both are set, `datasource` takes precedence. Use `navItem()` / " +
        "`navGroup()` factory helpers to build the tree ergonomically.\n\n" +
        "### Other inputs\n" +
        "| Input | Type | Default | Purpose |\n" +
        "|-------|------|---------|--------|\n" +
        "| `rootLabel` | `string` | `'Home'` | First breadcrumb label |\n" +
        "| `sidebarPinned` | `boolean` | `true` | Pin sidebar vs drawer mode |\n" +
        "| `drawerPosition` | `DrawerPosition` | `'left'` | Drawer slide direction |\n" +
        "| `drawerWidth` | `DrawerWidth` | `'medium'` | Drawer panel width |\n" +
        "| `breadcrumbVariant` | `BreadcrumbVariant` | `'button'` | Breadcrumb style |\n\n" +
        "### Two-way bindings\n" +
        "| Model | Type | Purpose |\n" +
        "|-------|------|--------|\n" +
        "| `activePage` | `string` | Currently active node id |\n" +
        "| `drawerOpen` | `boolean` | Drawer open state (when not pinned) |"
      }
    }
  },
  render: () => ({ template: " " })
};
