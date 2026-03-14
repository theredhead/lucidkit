import {
    computed,
    Directive,
    inject,
    input,
} from '@angular/core';

import {
    UI_DENSITY_SCALE,
    UI_DENSITY_TOKENS,
    UIDensity,
} from './ui-density.model';
import { UIDensityService } from './ui-density.service';

@Directive({
    selector: '[uiDensity]',
    standalone: true,
    host: {
        '[attr.data-ui-density]': 'resolvedDensity()',
        '[style.--ui-density]': 'resolvedDensity()',
        '[style.--ui-density-scale]': 'densityScale()',
        '[style.--ui-control-height]': 'controlHeight()',
        '[style.--ui-cell-height]': 'cellHeight()',
        '[style.--ui-inline-padding]': 'inlinePadding()',
        '[style.--ui-block-padding]': 'blockPadding()',
        '[style.--ui-gap]': 'densityGap()',
        '[style.--ui-radius]': 'densityRadius()',
    },
})
export class UIDensityDirective {
    readonly uiDensity = input<UIDensity | null>(null);

    private readonly densityService = inject(UIDensityService);

    protected readonly resolvedDensity = computed<UIDensity>(
        () => this.uiDensity() ?? this.densityService.density(),
    );

    protected readonly densityScale = computed(() => UI_DENSITY_SCALE[this.resolvedDensity()]);
    protected readonly controlHeight = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].controlHeight);
    protected readonly cellHeight = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].cellHeight);
    protected readonly inlinePadding = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].inlinePadding);
    protected readonly blockPadding = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].blockPadding);
    protected readonly densityGap = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].gap);
    protected readonly densityRadius = computed(() => UI_DENSITY_TOKENS[this.resolvedDensity()].radius);
}
