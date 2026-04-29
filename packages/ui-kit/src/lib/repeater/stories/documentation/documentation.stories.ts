import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRepeater } from "../../repeater.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: UIRepeater,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRepeater` iterates over a datasource and stamps out an `<ng-template>` for each item — similar to `*ngFor` but driven by a pluggable `ArrayDatasource`. It adds **zero layout opinions**: the host component fully controls the CSS layout (grid, flex, columns, etc.).",
      },
    },
  },
  argTypes: {
    reorderable: {
      control: "boolean",
      description: "Enables drag-and-drop reordering of items.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the repeater list.",
    },
  },
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UIRepeater>;

export default meta;
type Story = StoryObj<UIRepeater>;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — accepts any `ArrayDatasource<T>` (same interface used by `<ui-table-view>`)",
          "- **Template context** — each item template receives `$implicit` (the item), plus `index`, `first`, `last`, `even`, `odd` context variables",
          "- **Limit** — optionally cap the number of rendered items with `[limit]`",
          "- **Layout-agnostic** — no wrapper element or layout styles; the host decides the visual arrangement",
          '- **Drag-and-drop reorder** — enable `[reorderable]="true"` to let users drag items into a new order within a single repeater',
          "- **Cross-list transfer** — connect multiple repeaters with `[connectedTo]` to allow items to be dragged between them",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `ArrayDatasource<T>` | *(required)* | The data to iterate over |",
          "| `limit` | `number` | — | Maximum items to render |",
          "| `reorderable` | `boolean` | `false` | Enable drag-and-drop reordering |",
          "| `connectedTo` | `UIRepeater[]` | `[]` | Other repeaters to allow transfer to/from |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `reordered` | `{ previousIndex, currentIndex }` | Emitted when an item is reordered within this repeater |",
          "| `transferred` | `{ item, previousIndex, currentIndex }` | Emitted on the target when an item is transferred from another repeater |",
          "",
          "## Template Context",
          "",
          "| Variable | Type | Description |",
          "|----------|------|-------------|",
          "| `$implicit` | `T` | The current item |",
          "| `index` | `number` | Zero-based item index |",
          "| `first` | `boolean` | `true` for the first item |",
          "| `last` | `boolean` | `true` for the last item |",
          "| `even` | `boolean` | `true` for even-indexed items |",
          "| `odd` | `boolean` | `true` for odd-indexed items |",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
