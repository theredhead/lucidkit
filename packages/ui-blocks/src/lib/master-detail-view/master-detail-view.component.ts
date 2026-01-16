import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

export interface MasterItem {
    id: string | number;
    label: string;
    [key: string]: any;
}

/** Context provided to the itemTemplate */
export interface ItemTemplateContext {
    $implicit: MasterItem;
    item: MasterItem;
    selected: boolean;
}

/** Context provided to the detailTemplate */
export interface DetailTemplateContext<T = unknown> {
    $implicit: T;
    data: T;
    item: MasterItem;
}

/** Context provided to the filterTemplate */
export interface FilterTemplateContext {
    $implicit: MasterItem[];
    items: MasterItem[];
}

/** Context provided to the actionsTemplate */
export interface ActionsTemplateContext {
    $implicit: MasterItem | null;
    selectedItem: MasterItem | null;
}

@Component({
    selector: 'ui-master-detail-view',
    standalone: true,
    imports: [CommonModule, MatListModule, MatDividerModule, MatButtonModule],
    templateUrl: './master-detail-view.component.html',
    styleUrls: ['./master-detail-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMasterDetailViewComponent<T = unknown> {
    readonly items = input<MasterItem[]>([]);
    readonly selectedItemId = input<string | number | null>(null);
    readonly masterTitle = input<string>('Items');
    readonly detailPlaceholderText = input<string>('Select an item to view details');

    /** Optional detail data - can be a computed signal result, service data, etc. */
    readonly detailData = input<T | null>(null);

    readonly onSelectItem = output<MasterItem>();

    /** Optional template for rendering list items */
    readonly itemTemplate = contentChild<TemplateRef<ItemTemplateContext>>('itemTemplate');

    /** Optional template for rendering the detail view */
    readonly detailTemplate = contentChild<TemplateRef<DetailTemplateContext<T>>>('detailTemplate');

    /** Optional template for filter controls displayed above the list */
    readonly filterTemplate = contentChild<TemplateRef<FilterTemplateContext>>('filterTemplate');

    /** Optional template for action buttons displayed below the list */
    readonly actionsTemplate = contentChild<TemplateRef<ActionsTemplateContext>>('actionsTemplate');

    readonly selectedItem = computed(() => {
        const selectedId = this.selectedItemId();
        if (!selectedId) return null;
        return this.items().find((item) => item.id === selectedId) || null;
    });

    readonly isItemSelected = (itemId: string | number) => {
        return this.selectedItemId() === itemId;
    };

    /** Context for item template */
    getItemContext(item: MasterItem): ItemTemplateContext {
        return {
            $implicit: item,
            item,
            selected: this.isItemSelected(item.id),
        };
    }

    /** Context for detail template */
    readonly detailContext = computed((): DetailTemplateContext<T> | null => {
        const item = this.selectedItem();
        const data = this.detailData();
        if (!item) return null;
        return {
            $implicit: data as T,
            data: data as T,
            item,
        };
    });

    /** Context for filter template */
    readonly filterContext = computed((): FilterTemplateContext => ({
        $implicit: this.items(),
        items: this.items(),
    }));

    /** Context for actions template */
    readonly actionsContext = computed((): ActionsTemplateContext => ({
        $implicit: this.selectedItem(),
        selectedItem: this.selectedItem(),
    }));
}
