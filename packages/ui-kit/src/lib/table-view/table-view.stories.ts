import { ChangeDetectionStrategy, Component } from "@angular/core";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { UIDensity, UIDensityDirective } from "../ui-density";
import { UIBadgeColumn } from "./columns/badge-column/badge-column.component";
import { UINumberColumn } from "./columns/number-column/number-column.component";
import { UITextColumn } from "./columns/text-column/text-column.component";
import { DatasourceAdapter } from "./datasources/datasource-adapter";
import {
  JsonPlaceholderCommentsDatasource,
  JsonPlaceholderPhotosDatasource,
  JsonPlaceholderPostsDatasource,
} from "./datasources/jsonplaceholder-datasource";
import { UITableView } from "./table-view.component";

@Component({
  selector: "ui-table-view-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="comfortable"
      caption="JSONPlaceholder Posts"
      tableId="story-posts"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="userId"
        headerText="User ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
    </ui-table-view>
  `,
})
class UITableViewStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPostsDatasource(25),
  );
}

@Component({
  selector: "ui-table-view-comments-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="compact"
      caption="JSONPlaceholder Comments"
      tableId="story-comments"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="postId"
        headerText="Post ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="email"
        headerText="Email"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-text-column key="body" headerText="Comment" [truncate]="true" />
    </ui-table-view>
  `,
})
class UITableViewCommentsStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderCommentsDatasource(25),
  );
}

@Component({
  selector: "ui-table-view-photos-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="generous"
      caption="JSONPlaceholder Photos"
      tableId="story-photos"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="albumId"
        headerText="Album ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-text-column
        key="thumbnailUrl"
        headerText="Thumbnail URL"
        [truncate]="true"
      />
    </ui-table-view>
  `,
})
class UITableViewPhotosStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPhotosDatasource(25),
  );
}

const meta: Meta<object> = {
  title: "@Sigmax/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Table View demo backed by JSONPlaceholder posts using the Storybook-only JSONPlaceholder datasource adapters.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<object>;

export const JsonPlaceholderPosts: Story = {};

export const JsonPlaceholderComments: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewCommentsStoryDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-comments-story-demo />",
    props: {},
  }),
};

export const JsonPlaceholderPhotos: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewPhotosStoryDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-photos-story-demo />",
    props: {},
  }),
};

export const DensityPlayground: Story = {
  decorators: [
    moduleMetadata({
      imports: [
        UITableView,
        UINumberColumn,
        UITextColumn,
        UIBadgeColumn,
        UIDensityDirective,
        UiThemeToggleComponent,
      ],
    }),
  ],
  argTypes: {
    density: {
      control: "inline-radio",
      options: [
        "small",
        "compact",
        "comfortable",
        "generous",
      ] satisfies UIDensity[],
      description:
        "Applies global density tokens through the uiDensity directive.",
    },
    showBuiltInPaginator: {
      control: "boolean",
      description: "Show/hide the built-in table paginator footer.",
    },
    showRowIndexIndicator: {
      control: "boolean",
      description: "Show/hide a leading row-index indicator column.",
    },
    pageSize: {
      control: { type: "number", min: 5, max: 100, step: 5 },
      description: "Initial page size passed to DatasourceAdapter.",
    },
  },
  args: {
    density: "comfortable",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    pageSize: 25,
  },
  render: (args) => ({
    props: {
      density: (args as { density: UIDensity }).density,
      showBuiltInPaginator: (args as { showBuiltInPaginator: boolean })
        .showBuiltInPaginator,
      showRowIndexIndicator: (args as { showRowIndexIndicator: boolean })
        .showRowIndexIndicator,
      adapter: new DatasourceAdapter(
        new JsonPlaceholderPostsDatasource(
          (args as { pageSize: number }).pageSize,
        ),
        (args as { pageSize: number }).pageSize,
      ),
    },
    template: `
            <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
                <ui-theme-toggle variant="button" [showTooltip]="true" ariaLabel="Toggle table theme" />
            </div>
            <ui-table-view
                [uiDensity]="density"
                caption="Density Playground"
                tableId="story-density"
                [showRowIndexIndicator]="showRowIndexIndicator"
                [showBuiltInPaginator]="showBuiltInPaginator"
                [datasource]="adapter"
            >
                <ui-number-column
                    key="id"
                    headerText="ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-number-column
                    key="userId"
                    headerText="User ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-text-column
                    key="title"
                    headerText="Title"
                    [truncate]="true"
                    [sortable]="true"
                />
                <ui-badge-column
                    key="userId"
                    headerText="Owner"
                    variant="neutral"
                />
            </ui-table-view>
        `,
  }),
};

export const WithoutBuiltInPaginator: Story = {
  decorators: [
    moduleMetadata({
      imports: [
        UITableView,
        UINumberColumn,
        UITextColumn,
        UIBadgeColumn,
        UIDensityDirective,
        UiThemeToggleComponent,
      ],
    }),
  ],
  render: () => ({
    props: {
      adapter: new DatasourceAdapter(
        new JsonPlaceholderPostsDatasource(25),
        25,
      ),
    },
    template: `
            <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
                <ui-theme-toggle variant="button" [showTooltip]="true" ariaLabel="Toggle table theme" />
            </div>
            <ui-table-view
                uiDensity="comfortable"
                caption="Without Built-in Paginator"
                tableId="story-no-paginator"
                [showRowIndexIndicator]="true"
                [showBuiltInPaginator]="false"
                [datasource]="adapter"
            >
                <ui-number-column
                    key="id"
                    headerText="ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-number-column
                    key="userId"
                    headerText="User ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-text-column
                    key="title"
                    headerText="Title"
                    [truncate]="true"
                    [sortable]="true"
                />
                <ui-badge-column
                    key="userId"
                    headerText="Owner"
                    variant="neutral"
                />
            </ui-table-view>
        `,
  }),
};
