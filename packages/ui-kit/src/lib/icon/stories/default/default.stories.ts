import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";
import { UIIcons } from "../../lucide-icons.generated";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: UIIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders an inline SVG icon from a raw SVG string. The library ships " +
          "a categorised icon registry (`UIIcons.Lucide`) generated from the " +
          "[Lucide](https://lucide.dev) icon set, but you can also create and use " +
          "**your own custom icons**.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UIIcon>;

export default meta;
type Story = StoryObj<UIIcon>;

export const Default: Story = {
  args: {
    size: 24,
    ariaLabel: "",
  },
  parameters: {
    docs: {
      description: {
        story:
        "> **Lucide Icons** — Created by [Cole Bemis](https://github.com/colebemis) " +
        "as a fork of [Feather Icons](https://feathericons.com), now maintained by " +
        "[Eric Fennis](https://github.com/ericfennis) and the " +
        "[Lucide community](https://github.com/lucide-icons/lucide). " +
        "Licensed under the [ISC Licence](https://github.com/lucide-icons/lucide/blob/main/LICENSE).\n\n" +
        "### Features\n" +
        "- **Tree-shakeable** — only referenced icons end up in the bundle\n" +
        "- **Scalable** — `size` input controls width & height in pixels\n" +
        "- **Accessible** — optional `ariaLabel`; icons are `aria-hidden` by default\n" +
        "- **Categorised** — `UIIcons.Lucide.Text.*`, `UIIcons.Lucide.Navigation.*`, etc.\n" +
        "- **Extensible** — supply any SVG inner markup string as a custom icon\n\n" +
        "### Inputs\n" +
        "| Input | Type | Default | Description |\n" +
        "|-------|------|---------|-------------|\n" +
        "| `svg` | `string` | *(required)* | Raw SVG inner markup (paths, circles, etc.) |\n" +
        "| `size` | `number` | `24` | Icon dimensions in px |\n" +
        "| `ariaLabel` | `string` | `''` | Accessible label (sets `aria-hidden=\"false\"`) |\n\n" +
        "### Using built-in icons\n" +
        "```ts\n" +
        "import { UIIcon, UIIcons } from '@theredhead/lucid-kit';\n" +
        "```\n" +
        "```html\n" +
        '<ui-icon [svg]="UIIcons.Lucide.Text.Bold" [size]="20" />\n' +
        "```\n\n" +
        "### Using custom icons\n" +
        "The `svg` input accepts any string of SVG inner markup. The component " +
        'wraps it in a `<svg>` element with `viewBox="0 0 24 24"` and stroke-based ' +
        "rendering. Design your custom icons on a 24 × 24 grid.\n" +
        "```ts\n" +
        "const MyIcons = {\n" +
        '  Diamond: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59..." />`,\n' +
        "};\n" +
        "```\n" +
        "```html\n" +
        '<ui-icon [svg]="MyIcons.Diamond" />\n' +
        "```\n\n" +
        "See the **Custom Icons** story for a full working example."
      }
    }
  },
  render: (args) => ({
    props: {
      ...args,
      svg: args.svg || UIIcons.Lucide.Text.Bold,
    },
    template: `<ui-icon [svg]="svg" [size]="size" [ariaLabel]="ariaLabel" />`,
  })
};
