import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { DrawerPosition, DrawerWidth } from "@theredhead/lucid-kit";

import { DemoNavPageRouterComponent } from "./router-integration.story";

interface NavigationPageRouterStoryArgs {
  readonly drawerPosition: DrawerPosition;
  readonly drawerWidth: DrawerWidth;
  readonly ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Blocks/Navigation Page",
  component: DemoNavPageRouterComponent,
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
      options: ["narrow", "medium", "wide"],
      description: "Width preset for the navigation drawer.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation page.",
    },
  },
  decorators: [moduleMetadata({ imports: [DemoNavPageRouterComponent] })],
} satisfies Meta<NavigationPageRouterStoryArgs>;

export default meta;
type Story = StoryObj<NavigationPageRouterStoryArgs>;

export const RouterIntegration: Story = {
  args: {
    drawerPosition: "left",
    drawerWidth: "medium",
    ariaLabel: "Page navigation",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-nav-page-router [drawerPosition]="drawerPosition" [drawerWidth]="drawerWidth" [ariaLabel]="ariaLabel"></ui-demo-nav-page-router>',
  }),
};
