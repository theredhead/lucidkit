import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIBreadcrumb, type BreadcrumbVariant } from "../../breadcrumb.component";

import { PlaygroundStorySource } from "./playground.story";

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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<UIBreadcrumb>;

export default meta;
type Story = StoryObj<UIBreadcrumb>;

export const Playground: Story = {
  args: {
    variant: "link",
    separator: "/",
    disabled: false,
    ariaLabel: "Breadcrumb",
  },
  render: (args) => ({
    props: {
      ...args,
      items: [
        { label: "Home", url: "/" },
        { label: "Products", url: "/products" },
        { label: "Detail" },
      ],
    },
    template: `<ui-breadcrumb
      [items]="items"
      [variant]="variant"
      [separator]="separator"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  })
};
