import {
    Injectable,
    signal,
    Signal,
} from '@angular/core';

import {
    DEFAULT_UI_DENSITY,
    UIDensity,
} from './ui-density.model';

@Injectable({
    providedIn: 'root',
})
export class UIDensityService {
    private readonly _density = signal<UIDensity>(DEFAULT_UI_DENSITY);

    get density(): Signal<UIDensity> {
        return this._density.asReadonly();
    }

    setDensity(density: UIDensity): void {
        this._density.set(density);
    }

    reset(): void {
        this._density.set(DEFAULT_UI_DENSITY);
    }
}
