import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

export interface MasterItem {
    id: string | number;
    label: string;
    [key: string]: any;
}

@Component({
    selector: 'ui-master-detail-view',
    standalone: true,
    imports: [CommonModule, MatListModule, MatDividerModule, MatButtonModule],
    templateUrl: './master-detail-view.component.html',
    styleUrls: ['./master-detail-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMasterDetailViewComponent {
    readonly items = input<MasterItem[]>([]);
    readonly selectedItemId = input<string | number | null>(null);
    readonly masterTitle = input<string>('Items');
    readonly detailPlaceholderText = input<string>('Select an item to view details');

    readonly onSelectItem = output<MasterItem>();

    readonly selectedItem = computed(() => {
        const selectedId = this.selectedItemId();
        if (!selectedId) return null;
        return this.items().find((item) => item.id === selectedId) || null;
    });

    readonly isItemSelected = (itemId: string | number) => {
        return this.selectedItemId() === itemId;
    };
}
