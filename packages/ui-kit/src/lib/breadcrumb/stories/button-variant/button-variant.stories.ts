import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BreadcrumbVariant } from "../../breadcrumb.component";

import { BreadcrumbButtonDemo } from "./button-variant.story";

const meta = {
  title: "@theredhead/UI Kit/Breadcrumb",
  component: BreadcrumbButtonDemo,
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
  decorators: [moduleMetadata({ imports: [BreadcrumbButtonDemo] })],
} satisfies Meta<BreadcrumbButtonDemo>;

export default meta;
type Story = StoryObj<BreadcrumbButtonDemo>;

export const ButtonVariant: Story = {
  args: {
    variant: "button",
    separator: "/",
    disabled: false,
    ariaLabel: "Breadcrumb",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-breadcrumb-button-demo
      [variant]="variant"
      [separator]="separator"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
