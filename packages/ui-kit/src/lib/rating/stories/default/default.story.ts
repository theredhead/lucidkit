import { Component, signal } from '@angular/core';
import { UIRating } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIRating],
  template: `<ui-rating [(value)]="stars" />`,
})
export class ExampleComponent {
  public readonly stars = signal(0);
}
