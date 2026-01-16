import type {
  Meta,
  StoryObj,
} from '@storybook/angular';

import {
  type MasterItem,
  UiMasterDetailViewComponent,
} from './master-detail-view.component';

const sampleItems: MasterItem[] = [
    { id: 1, label: 'Document A', description: 'First document description', status: 'active' },
    { id: 2, label: 'Document B', description: 'Second document with more details', status: 'pending' },
    { id: 3, label: 'Document C', description: 'Third document info', status: 'completed' },
    { id: 4, label: 'Document D', description: 'Fourth item in the list', status: 'active' },
    { id: 5, label: 'Document E', description: 'Fifth and final document', status: 'archived' },
];

const meta: Meta<UiMasterDetailViewComponent> = {
    title: 'UI Blocks/Master Detail View',
    component: UiMasterDetailViewComponent,
    tags: ['autodocs'],
    argTypes: {
        items: {
            control: 'object',
            description: 'Array of items to display in the master list',
        },
        selectedItemId: {
            control: 'text',
            description: 'ID of the currently selected item',
        },
        masterTitle: {
            control: 'text',
            description: 'Title displayed above the master list',
        },
        detailPlaceholderText: {
            control: 'text',
            description: 'Text shown when no item is selected',
        },
    },
    decorators: [
        (story) => ({
            ...story(),
            styles: [`
        :host {
          display: block;
          height: 400px;
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
        }
      `],
        }),
    ],
};

export default meta;
type Story = StoryObj<UiMasterDetailViewComponent>;

/**
 * Default master-detail view with no selection.
 */
export const Default: Story = {
    args: {
        items: sampleItems,
        selectedItemId: null,
        masterTitle: 'Documents',
        detailPlaceholderText: 'Select a document to view details',
    },
};

/**
 * Master-detail view with a pre-selected item.
 */
export const WithSelection: Story = {
    args: {
        items: sampleItems,
        selectedItemId: 2,
        masterTitle: 'Documents',
        detailPlaceholderText: 'Select a document to view details',
    },
};

/**
 * Empty state with no items.
 */
export const Empty: Story = {
    args: {
        items: [],
        selectedItemId: null,
        masterTitle: 'Documents',
        detailPlaceholderText: 'No documents available',
    },
};

/**
 * Custom titles and placeholder text.
 */
export const CustomTitles: Story = {
    args: {
        items: [
            { id: 'user-1', label: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { id: 'user-2', label: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
            { id: 'user-3', label: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
        ],
        selectedItemId: null,
        masterTitle: 'Team Members',
        detailPlaceholderText: 'Click on a team member to see their profile',
    },
};

/**
 * Long list of items to demonstrate scrolling.
 */
export const LongList: Story = {
    args: {
        items: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            label: `Item ${i + 1}`,
            description: `Description for item ${i + 1}`,
        })),
        selectedItemId: null,
        masterTitle: 'All Items',
        detailPlaceholderText: 'Select an item',
    },
};

/**
 * Interactive example showing selection behavior.
 */
export const Interactive: Story = {
    render: () => ({
        template: `
      <ui-master-detail-view
        [items]="items"
        [selectedItemId]="selectedId"
        masterTitle="Projects"
        detailPlaceholderText="Select a project to view details"
        (onSelectItem)="onSelect($event)"
      >
      </ui-master-detail-view>
      <p style="margin-top: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
        Selected: {{ selectedId || 'None' }}
      </p>
    `,
        props: {
            items: sampleItems,
            selectedId: null as string | number | null,
            onSelect(item: MasterItem) {
                this['selectedId'] = item.id;
            },
        },
    }),
};
