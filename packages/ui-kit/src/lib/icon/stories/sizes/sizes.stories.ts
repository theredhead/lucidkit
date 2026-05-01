import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";
import { UIIcons } from "../../lucide-icons.generated";

import { SizesStorySource } from "./sizes.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: SizesStorySource,
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
  decorators: [moduleMetadata({ imports: [SizesStorySource] })]
} satisfies Meta<SizesStorySource>;

export default meta;
type Story = StoryObj<SizesStorySource>;

export const Sizes: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    props: {
      svg: UIIcons.Lucide.Text.Bold,
      sizes: [12, 16, 20, 24, 32, 48],
    },
    template: `
      <div style="display:flex; align-items:center; gap:16px;">
        @for (s of sizes; track s) {
          <div style="text-align:center">
            <ui-icon [svg]="svg" [size]="s" />
            <div style="font-size:11px;color:#888;margin-top:4px">{{ s }}px</div>
          </div>
        }
      </div>
    `,
  })
};
