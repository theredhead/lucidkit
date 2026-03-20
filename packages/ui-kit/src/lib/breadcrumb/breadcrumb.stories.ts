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
  parameters: {
    docs: {
      description: {
        component:
          "A navigation aid that shows the user’s current location within " +
          "a hierarchical structure.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbDemo, BreadcrumbButtonDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIBreadcrumb>;

/**
 * The link variant with three different separators: the default `/`,
 * an arrow `›`, and a pipe `|`. The last crumb (\"Monthly Report\")
 * has no `url` and renders as non-clickable text.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-breadcrumb-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Custom separator** — default `/`, or pass any string (`›`, `|`, etc.)\n" +
          "- **Link variant** (default) — crumbs render as `<a>` anchors\n" +
          "- **Button variant** — crumbs render as styled buttons with chevron separators\n" +
          "- **Active item** — the last item (no `url`) renders as plain text\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `items` | `BreadcrumbItem[]` | *(required)* | Array of `{ label, url? }` |\n" +
          "| `variant` | `'link' \\| 'button'` | `'link'` | Visual style |\n" +
          "| `separator` | `string` | `'/'` | Separator between crumbs (link variant) |\n\n" +
          "### Output\n" +
          "| Output | Payload | Description |\n" +
          "|--------|---------|-------------|\n" +
          "| `itemClicked` | `BreadcrumbItem` | Emitted when a crumb is clicked |",
      },
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

/**
 * The `button` variant renders each crumb as a styled button, with
 * chevron icons as separators. This variant works well in
 * application-style UIs where breadcrumbs act as navigation buttons.
 */
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
