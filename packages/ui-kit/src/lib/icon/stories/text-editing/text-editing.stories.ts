import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";
import { UIIcons } from "../../lucide-icons.generated";

import { TextEditingStorySource } from "./text-editing.story";

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
  decorators: [moduleMetadata({ imports: [TextEditingStorySource] })]
} satisfies Meta<UIIcon>;

export default meta;
type Story = StoryObj<UIIcon>;

export const TextEditing: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    props: {
      icons: [
        { name: "Bold", svg: UIIcons.Lucide.Text.Bold },
        { name: "Italic", svg: UIIcons.Lucide.Text.Italic },
        { name: "Underline", svg: UIIcons.Lucide.Text.Underline },
        { name: "Strikethrough", svg: UIIcons.Lucide.Text.Strikethrough },
        { name: "Heading1", svg: UIIcons.Lucide.Text.Heading1 },
        { name: "Heading2", svg: UIIcons.Lucide.Text.Heading2 },
        { name: "Heading3", svg: UIIcons.Lucide.Text.Heading3 },
        { name: "List", svg: UIIcons.Lucide.Text.List },
        { name: "ListOrdered", svg: UIIcons.Lucide.Text.ListOrdered },
        { name: "Code", svg: UIIcons.Lucide.Development.Code },
        { name: "RemoveFormatting", svg: UIIcons.Lucide.Text.RemoveFormatting },
      ],
    },
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        @for (icon of icons; track icon.name) {
          <div style="text-align:center; min-width:60px;">
            <ui-icon [svg]="icon.svg" [size]="20" />
            <div style="font-size:10px;color:#888;margin-top:4px">{{ icon.name }}</div>
          </div>
        }
      </div>
    `,
  })
};
