import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CardVariant, UICard } from "../../card.component";
import { UICardStoryElevated } from "./elevated.story";

const meta = {
  title: "@theredhead/UI Kit/Card",
  component: UICard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile content container with optional header, body, and footer " +
          "projection slots. `ui-card-header` also supports an optional leading icon or avatar.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"] satisfies CardVariant[],
      description: "Controls elevation, border, and background treatment.",
    },
    interactive: {
      control: "boolean",
      description:
        "When `true`, the card responds to hover/focus with elevation change and lift effect.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UICardStoryElevated],
    }),
  ],
} satisfies Meta<UICard>;

export default meta;
type Story = StoryObj;

export const Elevated: Story = {
  render: (args) => ({
    props: args,
    template:
      '<ui-card-story-elevated [variant]="variant" [interactive]="interactive" />',
  }),
  args: { variant: "elevated", interactive: false },
  parameters: {
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Visual treatment |\n" +
          "|---------|--------------------|\n" +
          "| `elevated` | Drop shadow, no border |\n" +
          "| `outlined` | 1px border, no shadow |\n" +
          "| `filled` | Solid background, no border or shadow |\n\n" +
          "### Sub-components\n" +
          "- `<ui-card-header>` — Title area (bold, top padding)\n" +
          "- `<ui-card-body>` — Main content area\n" +
          "- `<ui-card-footer>` — Right-aligned action area (flex row)\n\n" +
          "All three are optional — you can also project content directly into `<ui-card>`.",
      },
    },
  },
};
