import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIAvatar } from "./avatar.component";

@Component({
  selector: "ui-avatar-demo",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Sizes</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar name="Jane Doe" size="xs" />
          <ui-avatar name="Jane Doe" size="sm" />
          <ui-avatar name="Jane Doe" size="md" />
          <ui-avatar name="Jane Doe" size="lg" />
          <ui-avatar name="Jane Doe" size="xl" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">With images</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar
            src="https://picsum.photos/seed/av1/100/100"
            name="Alice"
            size="md"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av2/100/100"
            name="Bob"
            size="md"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av3/100/100"
            name="Charlie"
            size="lg"
          />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Initials (no image)</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar name="Kris van Rens" size="md" />
          <ui-avatar name="Emily" size="md" />
          <ui-avatar name="Maximilian Von Habsburg" size="lg" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Fallback (no name, no image)</h4>
        <ui-avatar size="lg" />
      </div>
    </div>
  `,
})
class AvatarDemo {}

const meta: Meta<UIAvatar> = {
  title: "@Theredhead/UI Kit/Avatar",
  component: UIAvatar,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AvatarDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAvatar>;

/** All avatar variants: sizes, images, initials, fallback. */
export const Default: Story = {
  render: () => ({
    template: `<ui-avatar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- With image -->
<ui-avatar src="https://example.com/photo.jpg" name="Alice" size="md" />

<!-- Initials fallback (no image) -->
<ui-avatar name="Kris van Rens" size="md" />

<!-- Size variants: xs, sm, md, lg, xl -->
<ui-avatar name="Jane Doe" size="xs" />
<ui-avatar name="Jane Doe" size="sm" />
<ui-avatar name="Jane Doe" size="lg" />
<ui-avatar name="Jane Doe" size="xl" />`,
        language: "html",
      },
    },
  },
};
