import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateComponent } from "./autogenerate.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: UITableView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A structural directive that automatically generates table columns " +
          "by introspecting the first row of a `UITableView` datasource.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [DemoAutogenerateComponent] })]
} satisfies Meta<UITableView>;

export default meta;
type Story = StoryObj<UITableView>;

export const Autogenerate: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Key Features\n\n" +
        "- **Zero-config columns** \u2014 attach `uiAutogenerateColumns` and the directive creates a `UITextColumn` for every property in the first data row\n" +
        '- **Header humanization** \u2014 `camelCase` and `snake_case` keys are converted to title-cased labels (e.g. `firstName` \u2192 "First Name")\n' +
        "- **Custom header mapping** \u2014 override individual headers via `headerMap`\n" +
        "- **Exclude keys** \u2014 hide properties via `excludeKeys`\n" +
        "- **Reactive** \u2014 columns regenerate when the datasource or config signal changes\n" +
        "- **Works with `UIFilter`** \u2014 combine with `inferFilterFields()` for fully auto-generated table + filter UIs\n\n" +
        "### Configuration\n\n" +
        "| Property | Type | Default | Description |\n" +
        "|----------|------|---------|-------------|\n" +
        "| `humanizeHeaders` | `boolean` | `true` | Convert camelCase/snake_case keys to title-cased labels |\n" +
        "| `headerMap` | `Record<string, string>` | `{}` | Explicit header text overrides per key |\n" +
        "| `excludeKeys` | `string[]` | `[]` | Property keys to omit from the generated columns |\n\n" +
        "### Usage Modes\n\n" +
        "| Mode | Syntax |\n" +
        "|------|--------|\n" +
        "| No config (defaults) | `uiAutogenerateColumns` |\n" +
        '| With config object | `[uiAutogenerateColumns]="config"` |'
      }
    }
  },
  render: () => ({
      template: "<ui-demo-autogenerate />",
    })
};
