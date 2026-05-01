import type { UIDensity } from "../../ui-density";
import type { SelectionMode } from "../../core/selection-model";

export interface TableViewStoryArgs {
  readonly caption: string;
  readonly selectionMode: SelectionMode;
  readonly showBuiltInPaginator: boolean;
  readonly showRowIndexIndicator: boolean;
  readonly showSelectionColumn: boolean;
  readonly rowClickSelect: boolean;
  readonly pageSize: number | undefined;
  readonly disabled: boolean;
}

export interface TableViewDensityStoryArgs extends TableViewStoryArgs {
  readonly density: UIDensity;
}

export const TABLE_VIEW_STORY_ARG_TYPES = {
  caption: {
    control: "text",
    description: "Visible <caption> for the table.",
  },
  selectionMode: {
    control: "select",
    options: ["none", "single", "multiple"],
    description: "Row selection behaviour.",
  },
  showBuiltInPaginator: {
    control: "boolean",
    description: "Show the built-in pagination footer.",
  },
  showRowIndexIndicator: {
    control: "boolean",
    description: "Show a row-index column.",
  },
  showSelectionColumn: {
    control: "boolean",
    description: "Show the checkbox / radio selection column.",
  },
  rowClickSelect: {
    control: "boolean",
    description: "Select a row by clicking anywhere on it.",
  },
  pageSize: {
    control: "number",
    description: "Items per page.",
  },
  disabled: {
    control: "boolean",
    description: "Disables the table.",
  },
} as const;
