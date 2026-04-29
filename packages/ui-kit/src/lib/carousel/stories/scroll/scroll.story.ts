import { Component, signal } from '@angular/core';
import { UICarousel, ScrollCarouselStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template: \`
    <ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-photo>
        <img [src]="photo.url" [alt]="photo.name" />
      </ng-template>
    </ui-carousel>
  \`,
})
export class ExampleComponent {
  readonly photos = [
    { name: 'Whiskers', url: 'https://picsum.photos/seed/carousel1/280/200' },
    { name: 'Mittens',  url: 'https://picsum.photos/seed/carousel2/280/200' },
    { name: 'Shadow',   url: 'https://picsum.photos/seed/carousel3/280/200' },
  ];
  readonly strategy = new ScrollCarouselStrategy();
  readonly active = signal(0);
}
