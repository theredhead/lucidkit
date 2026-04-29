import { Component } from '@angular/core';
import { UIAnalogClock, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`
    <ui-analog-clock
      [dayIcon]="sparkles"
      dayIconColor="#ec4899"
      [nightIcon]="star"
      nightIconColor="#fbbf24"
    />
  \`,
})
export class ExampleComponent {
  sparkles = UIIcons.Lucide.Weather.Sparkles;
  star = UIIcons.Lucide.Weather.Star;
}
