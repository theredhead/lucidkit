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

@Component({
  selector: "ui-breadcrumb-button-demo",
  standalone: true,
  imports: [UIBreadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Button variant with chevron separators</h4>
        <ui-breadcrumb [items]="items" variant="button" />
      </div>
    </div>
  `,
})
class BreadcrumbButtonDemo {
  public readonly items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Dashboard", url: "/dashboard" },
    { label: "Analytics", url: "/dashboard/analytics" },
    { label: "Monthly Report" },
  ];
}

const meta: Meta<UIBreadcrumb> = {
  title: "@Theredhead/UI Kit/Breadcrumb",
  component: UIBreadcrumb,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbDemo, BreadcrumbButtonDemo],
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
  parameters: {
    docs: {
      source: {
        code: `<ui-breadcrumb [items]="items" />
<ui-breadcrumb [items]="items" separator="›" />
<ui-breadcrumb [items]="items" separator="|" />

<!-- Component class:
readonly items: BreadcrumbItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/dashboard' },
  { label: 'Analytics', url: '/dashboard/analytics' },
  { label: 'Monthly Report' },
]; -->`,
        language: "html",
      },
    },
  },
};

/** Button variant — crumbs are styled buttons separated by chevron icons. */
export const ButtonVariant: Story = {
  render: () => ({
    template: `<ui-breadcrumb-button-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-breadcrumb [items]="items" variant="button" />

<!-- Component class:
readonly items: BreadcrumbItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/dashboard' },
  { label: 'Monthly Report' },
]; -->`,
        language: "html",
      },
    },
  },
};
