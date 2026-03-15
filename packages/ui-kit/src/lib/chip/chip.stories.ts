import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIChip } from "./chip.component";

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
  decorators: [
    moduleMetadata({
      imports: [ChipDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIChip>;

/** Chip variants: colors, removable, disabled. */
export const Default: Story = {
  render: () => ({
    template: `<ui-chip-demo />`,
  }),
};
