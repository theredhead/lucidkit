import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type BreadcrumbItem,
  type BreadcrumbVariant,
} from "../../breadcrumb.component";

import { PlaygroundStorySource } from "./playground.story";

interface BreadcrumbPlaygroundStoryArgs {
  ariaLabel: string;
  disabled: boolean;
  items: readonly BreadcrumbItem[];
  separator: string;
  variant: BreadcrumbVariant;
  itemClicked: (item: BreadcrumbItem) => void;
}

const meta = {
  title: "@theredhead/UI Kit/Breadcrumb",
  component: PlaygroundStorySource,
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
    items: {
      control: "object",
      description: "Breadcrumb items rendered by the playground instance.",
    },
    itemClicked: {
      action: "itemClicked",
      description: "Emitted when a breadcrumb item is clicked.",
    },
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })],
} satisfies Meta<BreadcrumbPlaygroundStoryArgs>;

export default meta;
type Story = StoryObj<BreadcrumbPlaygroundStoryArgs>;

export const Playground: Story = {
  args: {
    variant: "link",
    separator: "/",
    disabled: false,
    ariaLabel: "Breadcrumb",
    items: [
      { label: "Home", url: "/" },
      { label: "Products", url: "/products" },
      { label: "Detail" },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<ui-playground-story-demo
      [items]="items"
      [variant]="variant"
      [separator]="separator"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (itemClicked)="itemClicked($event)"
    />`,
  }),
};
