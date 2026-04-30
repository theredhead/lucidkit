import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UINavigationPage } from "../../navigation-page.component";

import { DemoNavPageRouterComponent } from "./router-integration.story";

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
  decorators: [moduleMetadata({ imports: [DemoNavPageRouterComponent] })]
} satisfies Meta<UINavigationPage>;

export default meta;
type Story = StoryObj<UINavigationPage>;

export const RouterIntegration: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-nav-page-router />",
    })
};
