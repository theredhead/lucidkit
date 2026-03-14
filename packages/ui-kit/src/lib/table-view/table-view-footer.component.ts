import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';

@Component({
    selector: 'ui-table-footer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="table-footer">
            <span class="page-info">
                @if (totalItems() !== null) {
                    {{ rangeStart() }}–{{ rangeEnd() }} of {{ totalItems() }}
                } @else {
                    Page {{ pageIndex() + 1 }}
                }
            </span>
            <div class="page-controls">
                <button
                    class="page-btn"
                    (click)="prevPage()"
                    [disabled]="pageIndex() === 0"
                    aria-label="Previous page"
                >‹</button>
                <button
                    class="page-btn"
                    (click)="nextPage()"
                    [disabled]="!hasNextPage()"
                    aria-label="Next page"
                >›</button>
            </div>
        </div>
    `,
    styles: [`
        :host { display: block; }
        .table-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: var(--ui-gap, 0.75rem);
            padding: var(--ui-block-padding, 0.65rem) var(--ui-inline-padding, 0.85rem);
            border-top: 1px solid var(--tv-border);
            background: var(--tv-surface-2);
        }
        .page-info {
            font-size: calc(0.83rem * var(--ui-density-scale, 1));
            color: var(--tv-muted);
            margin-right: 0.25rem;
        }
        .page-controls { display: flex; gap: calc(var(--ui-gap, 0.75rem) * 0.45); }
        .page-btn {
            min-width: var(--ui-control-height, 2.05rem);
            height: var(--ui-control-height, 2.05rem);
            border-radius: var(--ui-radius, 0.55rem);
            border: 1px solid var(--tv-border-strong);
            background: var(--tv-surface);
            color: var(--tv-text);
            cursor: pointer;
            transition: background-color 120ms ease, border-color 120ms ease;
        }
        .page-btn:hover:not(:disabled) {
            background: color-mix(in srgb, var(--tv-accent) 18%, var(--tv-surface));
            border-color: var(--tv-accent);
        }
        .page-btn:disabled {
            opacity: 0.45;
            cursor: default;
        }
    `],
})
export class UITableFooter {
    pageIndex = input.required<number>();
    pageSize = input.required<number>();
    totalItems = input<number | null>(null);
    pageIndexChange = output<number>();

    rangeStart = computed(() => this.pageIndex() * this.pageSize() + 1);
    rangeEnd = computed(() => {
        const end = (this.pageIndex() + 1) * this.pageSize();
        const total = this.totalItems();
        return total !== null ? Math.min(end, total) : end;
    });
    hasNextPage = computed(() => {
        const total = this.totalItems();
        if (total === null) return true;
        return (this.pageIndex() + 1) * this.pageSize() < total;
    });

    prevPage(): void {
        if (this.pageIndex() > 0) {
            this.pageIndexChange.emit(this.pageIndex() - 1);
        }
    }

    nextPage(): void {
        if (this.hasNextPage()) {
            this.pageIndexChange.emit(this.pageIndex() + 1);
        }
    }
}
