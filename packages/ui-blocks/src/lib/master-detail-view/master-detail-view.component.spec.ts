import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
    MasterItem,
    UiMasterDetailViewComponent,
} from './master-detail-view.component';

describe('UiMasterDetailViewComponent', () => {
    let component: UiMasterDetailViewComponent;
    let fixture: ComponentFixture<UiMasterDetailViewComponent>;

    const mockItems: MasterItem[] = [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
        { id: 3, label: 'Item 3' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiMasterDetailViewComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(UiMasterDetailViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('inputs', () => {
        it('should have default empty items array', () => {
            expect(component.items()).toEqual([]);
        });

        it('should have default selectedItemId as null', () => {
            expect(component.selectedItemId()).toBeNull();
        });

        it('should have default masterTitle "Items"', () => {
            expect(component.masterTitle()).toBe('Items');
        });

        it('should have default detailPlaceholderText', () => {
            expect(component.detailPlaceholderText()).toBe('Select an item to view details');
        });
    });

    describe('items rendering', () => {
        it('should render list items when items are provided', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.detectChanges();

            const listItems = fixture.nativeElement.querySelectorAll('mat-list-item');
            expect(listItems.length).toBe(3);
        });

        it('should show empty state when no items are provided', () => {
            fixture.componentRef.setInput('items', []);
            fixture.detectChanges();

            const emptyState = fixture.nativeElement.querySelector('.ui-master-detail-view__empty-state');
            expect(emptyState).toBeTruthy();
            expect(emptyState.textContent.trim()).toBe('No items available');
        });

        it('should display item labels', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.detectChanges();

            const firstItem = fixture.nativeElement.querySelector('mat-list-item span[matListItemTitle]');
            expect(firstItem.textContent.trim()).toBe('Item 1');
        });
    });

    describe('master title', () => {
        it('should display custom master title', () => {
            fixture.componentRef.setInput('masterTitle', 'My Items');
            fixture.detectChanges();

            const header = fixture.nativeElement.querySelector('.ui-master-detail-view__master-header h2');
            expect(header.textContent.trim()).toBe('My Items');
        });
    });

    describe('item selection', () => {
        it('should emit onSelectItem when item is clicked', () => {
            const spy = jest.fn();
            component.onSelectItem.subscribe(spy);

            fixture.componentRef.setInput('items', mockItems);
            fixture.detectChanges();

            const firstItem = fixture.nativeElement.querySelector('mat-list-item');
            firstItem.click();

            expect(spy).toHaveBeenCalledWith(mockItems[0]);
        });

        it('should mark item as selected via isItemSelected', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', 2);
            fixture.detectChanges();

            expect(component.isItemSelected(2)).toBe(true);
            expect(component.isItemSelected(1)).toBe(false);
        });
    });

    describe('selectedItem computed', () => {
        it('should return null when no item is selected', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', null);
            fixture.detectChanges();

            expect(component.selectedItem()).toBeNull();
        });

        it('should return the selected item', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', 2);
            fixture.detectChanges();

            expect(component.selectedItem()).toEqual({ id: 2, label: 'Item 2' });
        });

        it('should return null if selectedItemId does not match any item', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', 999);
            fixture.detectChanges();

            expect(component.selectedItem()).toBeNull();
        });
    });

    describe('detail view', () => {
        it('should show placeholder when no item is selected', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', null);
            fixture.detectChanges();

            const placeholder = fixture.nativeElement.querySelector('.ui-master-detail-view__detail-placeholder');
            expect(placeholder).toBeTruthy();
        });

        it('should show custom placeholder text', () => {
            fixture.componentRef.setInput('detailPlaceholderText', 'Choose an item');
            fixture.detectChanges();

            const placeholder = fixture.nativeElement.querySelector('.ui-master-detail-view__detail-placeholder p');
            expect(placeholder.textContent.trim()).toBe('Choose an item');
        });

        it('should show detail content when item is selected', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', 1);
            fixture.detectChanges();

            const detailHeader = fixture.nativeElement.querySelector('.ui-master-detail-view__detail-header h2');
            expect(detailHeader.textContent.trim()).toBe('Item 1');
        });

        it('should show divider when item is selected', () => {
            fixture.componentRef.setInput('items', mockItems);
            fixture.componentRef.setInput('selectedItemId', 1);
            fixture.detectChanges();

            const divider = fixture.nativeElement.querySelector('mat-divider');
            expect(divider).toBeTruthy();
        });
    });

    describe('layout', () => {
        it('should have master panel', () => {
            const masterPanel = fixture.nativeElement.querySelector('.ui-master-detail-view__master');
            expect(masterPanel).toBeTruthy();
        });

        it('should have detail panel', () => {
            const detailPanel = fixture.nativeElement.querySelector('.ui-master-detail-view__detail');
            expect(detailPanel).toBeTruthy();
        });

        it('should have grid layout container', () => {
            const container = fixture.nativeElement.querySelector('.ui-master-detail-view');
            expect(container).toBeTruthy();
        });
    });
});
