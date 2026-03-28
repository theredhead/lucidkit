import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { type ChipColor, UIChip } from "./chip.component";

@Component({
  selector: "ui-chip-demo",
  standalone: true,
  imports: [UIChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Color variants</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px">
          <ui-chip color="neutral">Neutral</ui-chip>
          <ui-chip color="primary">Primary</ui-chip>
          <ui-chip color="success">Success</ui-chip>
          <ui-chip color="warning">Warning</ui-chip>
          <ui-chip color="danger">Danger</ui-chip>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Removable</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px">
          @for (tag of tags(); track tag) {
            <ui-chip
              color="primary"
              [removable]="true"
              (removed)="removeTag(tag)"
            >
              {{ tag }}
            </ui-chip>
          }
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Disabled</h4>
        <div style="display: flex; gap: 8px">
          <ui-chip [disabled]="true">Disabled</ui-chip>
          <ui-chip color="primary" [disabled]="true">Disabled</ui-chip>
        </div>
      </div>
    </div>
  `,
})
class ChipDemo {
  public readonly tags = signal([
    "Angular",
    "TypeScript",
    "Signals",
    "RxJS",
    "SCSS",
  ]);

  public removeTag(tag: string): void {
    this.tags.update((t) => t.filter((x) => x !== tag));
  }
}

const meta: Meta<UIChip> = {
  title: "@Theredhead/UI Kit/Chip",
  component: UIChip,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies ChipColor[],
      description: "Colour preset.",
    },
    removable: {
      control: "boolean",
      description: "Shows a dismiss button and emits `removed` on click.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the chip.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A compact element for displaying tags, labels, or filter tokens.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ChipDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIChip>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-chip
      [color]="color"
      [removable]="removable"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    >Sample chip</ui-chip>`,
  }),
  args: {
    color: "primary",
    removable: false,
    disabled: false,
    ariaLabel: "Sample chip",
  },
};

/**
 * Interactive demo showing all chip features: five colour presets,
 * removable chips with live tag management, and disabled states.
 * Remove a chip by clicking its × button and watch the list update.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-chip-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Five colour presets** — `neutral`, `primary`, `success`, `warning`, `danger`\n" +
          '- **Removable** — set `[removable]="true"` to show a dismiss button; listen to `(removed)`\n' +
          "- **Disabled** — greys out and blocks interaction\n" +
          "- **Content projection** — the chip label is projected content\n\n" +
          "Chips are used inside `UIAutocomplete` for multi-select tokens, but " +
          "can also be used standalone for tag lists or filter displays.\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<ui-chip color="primary" [removable]="true" (removed)="remove(tag)">\n' +
          "  {{ tag }}\n" +
          "</ui-chip>\n" +
          "```",
      },
      source: {
        code: `<!-- Color variants -->
<ui-chip color="neutral">Neutral</ui-chip>
<ui-chip color="primary">Primary</ui-chip>
<ui-chip color="success">Success</ui-chip>
<ui-chip color="warning">Warning</ui-chip>
<ui-chip color="danger">Danger</ui-chip>

<!-- Removable -->
<ui-chip color="primary" [removable]="true" (removed)="onRemove(tag)">
  {{ tag }}
</ui-chip>

<!-- Disabled -->
<ui-chip [disabled]="true">Disabled</ui-chip>`,
        language: "html",
      },
    },
  },
};
