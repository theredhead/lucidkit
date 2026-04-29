import { Component, signal } from '@angular/core';
import { UISlider, type SliderTick } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISlider],
  template: \`
    <ui-slider [(value)]="volume" [step]="20" [showTicks]="true" [showValue]="true" />
    <ui-slider [(value)]="rating" [ticks]="ticks" [showValue]="true" />
  \`,
})
export class ExampleComponent {
  readonly volume = signal(40);
  readonly rating = signal(50);
  readonly ticks: readonly SliderTick[] = [
    { value: 0, label: 'Min' },
    { value: 50, label: 'Mid' },
    { value: 100, label: 'Max' },
  ];
}
