import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'primary' | 'accent' | 'warn';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [MatButtonModule, MatProgressSpinnerModule, CommonModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
    readonly label = input<string>('Click me');
    readonly variant = input<ButtonVariant>('raised');
    readonly color = input<ButtonColor>('primary');
    readonly size = input<ButtonSize>('medium');
    readonly isDisabled = input<boolean>(false);
    readonly isLoading = signal<boolean>(false);

    readonly onClick = output<void>();
}
