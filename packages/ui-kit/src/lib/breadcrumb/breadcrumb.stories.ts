import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIBreadcrumb, type BreadcrumbItem } from "./breadcrumb.component";

@Component({
  selector: "ui-breadcrumb-demo",
  standalone: true,
  imports: [UIBreadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Default separator (/)</h4>
        <ui-breadcrumb [items]="items" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Arrow separator (›)</h4>
        <ui-breadcrumb [items]="items" separator="›" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Pipe separator (|)</h4>
        <ui-breadcrumb [items]="items" separator="|" />
      </div>
    </div>
  `,
})
class BreadcrumbDemo {
  public readonly items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Dashboard", url: "/dashboard" },
    { label: "Analytics", url: "/dashboard/analytics" },
    { label: "Monthly Report" },
  ];
}

const meta: Meta<UIBreadcrumb> = {
  title: "@theredhead/UI Kit/Breadcrumb",
  component: UIBreadcrumb,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIBreadcrumb>;

/** Breadcrumb with various separators. */
export const Default: Story = {
  render: () => ({
    template: `<ui-breadcrumb-demo />`,
  }),
};
