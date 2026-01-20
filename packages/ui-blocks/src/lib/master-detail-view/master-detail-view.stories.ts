import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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

// Mock detail data keyed by item ID
const mockDetailData: Record<number, { content: string; metadata: { created: string; modified: string; author: string } }> = {
    1: { content: 'Full content of Document A...', metadata: { created: '2025-01-01', modified: '2025-06-15', author: 'Alice' } },
    2: { content: 'Full content of Document B with extended info...', metadata: { created: '2025-02-10', modified: '2025-07-20', author: 'Bob' } },
    3: { content: 'Document C complete text here...', metadata: { created: '2025-03-05', modified: '2025-08-01', author: 'Charlie' } },
    4: { content: 'Document D body content...', metadata: { created: '2025-04-12', modified: '2025-09-10', author: 'Diana' } },
    5: { content: 'Document E archived content...', metadata: { created: '2025-05-20', modified: '2025-10-05', author: 'Eve' } },
};

const meta: Meta<UiMasterDetailViewComponent> = {
    title: '@Sigmax/UI Blocks/Master Detail View',
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
        detailData: {
            control: 'object',
            description: 'Optional detail data passed to the detail template',
        },
    },
    decorators: [
        (story) => ({
            ...story(),
            styles: [`
        :host {
          display: block;
          height: 400px;
          border: 1px solid var(--mat-sys-outline-variant, #ccc);
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

/**
 * Custom item template with status badge and description.
 */
export const CustomItemTemplate: Story = {
    render: () => ({
        template: `
      <ui-master-detail-view
        [items]="items"
        [selectedItemId]="selectedId"
        masterTitle="Documents"
        (onSelectItem)="selectedId = $event.id"
      >
        <ng-template #itemTemplate let-item let-selected="selected">
          <span matListItemTitle>{{ item.label }}</span>
          <span matListItemLine style="color: var(--mat-sys-on-surface-variant)">{{ item.description }}</span>
          <span matListItemMeta [style.color]="getStatusColor(item.status)">
            {{ item.status }}
          </span>
        </ng-template>
      </ui-master-detail-view>
    `,
        props: {
            items: sampleItems,
            selectedId: null as string | number | null,
            getStatusColor(status: string): string {
                const colors: Record<string, string> = {
                    active: '#4caf50',
                    pending: '#ff9800',
                    completed: '#2196f3',
                    archived: '#9e9e9e',
                };
                return colors[status] || '#000';
            },
        },
    }),
};

/**
 * Custom detail template with structured data display.
 */
export const CustomDetailTemplate: Story = {
    render: () => ({
        template: `
      <ui-master-detail-view
        [items]="items"
        [selectedItemId]="selectedId"
        [detailData]="getDetailData(selectedId)"
        masterTitle="Documents"
        (onSelectItem)="selectedId = $event.id"
      >
        <ng-template #detailTemplate let-data let-item="item">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <h4 style="margin: 0 0 8px; color: var(--mat-sys-on-surface-variant)">Content</h4>
              <p style="margin: 0">{{ data?.content || 'No content available' }}</p>
            </div>
            <div>
              <h4 style="margin: 0 0 8px; color: var(--mat-sys-on-surface-variant)">Metadata</h4>
              <dl style="margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 4px 16px;">
                <dt style="font-weight: 500">Author:</dt>
                <dd style="margin: 0">{{ data?.metadata?.author }}</dd>
                <dt style="font-weight: 500">Created:</dt>
                <dd style="margin: 0">{{ data?.metadata?.created }}</dd>
                <dt style="font-weight: 500">Modified:</dt>
                <dd style="margin: 0">{{ data?.metadata?.modified }}</dd>
              </dl>
            </div>
          </div>
        </ng-template>
      </ui-master-detail-view>
    `,
        props: {
            items: sampleItems,
            selectedId: null as string | number | null,
            detailDataMap: mockDetailData,
            getDetailData(id: string | number | null) {
                if (!id) return null;
                return this['detailDataMap'][id as number] || null;
            },
        },
    }),
};

/**
 * Full example with both custom item and detail templates.
 */
export const FullCustomization: Story = {
    render: () => ({
        template: `
      <ui-master-detail-view
        [items]="items"
        [selectedItemId]="selectedId"
        [detailData]="getDetailData(selectedId)"
        masterTitle="Project Files"
        detailPlaceholderText="Select a file to preview"
        (onSelectItem)="selectedId = $event.id"
      >
        <ng-template #itemTemplate let-item let-selected="selected">
          <mat-icon matListItemIcon [style.color]="selected ? 'var(--mat-sys-primary)' : 'var(--mat-sys-on-surface-variant)'">
            description
          </mat-icon>
          <span matListItemTitle>{{ item.label }}</span>
          <span matListItemLine>{{ item.description }}</span>
        </ng-template>

        <ng-template #detailTemplate let-data let-item="item">
          <div style="padding: 8px; background: var(--mat-sys-surface-container); border-radius: 8px; margin-bottom: 16px;">
            <mat-chip-set>
              <mat-chip>{{ item.status }}</mat-chip>
              <mat-chip>{{ data?.metadata?.author }}</mat-chip>
            </mat-chip-set>
          </div>
          <p>{{ data?.content }}</p>
          <p style="color: var(--mat-sys-on-surface-variant); font-size: 0.875rem;">
            Last modified: {{ data?.metadata?.modified }}
          </p>
        </ng-template>
      </ui-master-detail-view>
    `,
        moduleMetadata: {
            imports: [MatIconModule, MatChipsModule],
        },
        props: {
            items: sampleItems,
            selectedId: 1 as string | number | null,
            detailDataMap: mockDetailData,
            getDetailData(id: string | number | null) {
                if (!id) return null;
                return this['detailDataMap'][id as number] || null;
            },
        },
    }),
};

/**
 * Filter and actions templates for list management.
 */
export const WithFilterAndActions: Story = {
    render: () => ({
        template: `
      <ui-master-detail-view
        [items]="filteredItems"
        [selectedItemId]="selectedId"
        masterTitle="Documents"
        (onSelectItem)="selectedId = $event.id"
      >
        <ng-template #filterTemplate>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterItems()" placeholder="Filter items...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </ng-template>

        <ng-template #actionsTemplate let-selectedItem>
          <button mat-button (click)="onAdd()">
            <mat-icon>add</mat-icon>
            Add
          </button>
          <button mat-button [disabled]="!selectedItem" (click)="onDelete(selectedItem)">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </ng-template>
      </ui-master-detail-view>
    `,
        moduleMetadata: {
            imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
        },
        props: {
            items: sampleItems,
            filteredItems: [...sampleItems],
            selectedId: null as string | number | null,
            searchTerm: '',
            filterItems() {
                const term = this['searchTerm'].toLowerCase();
                this['filteredItems'] = this['items'].filter((item: MasterItem) =>
                    item.label.toLowerCase().includes(term)
                );
            },
            onAdd() {
                console.log('Add clicked');
            },
            onDelete(item: MasterItem | null) {
                if (item) console.log('Delete clicked for:', item.label);
            },
        },
    }),
};
