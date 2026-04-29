import { Component, signal } from '@angular/core';
import { UICarousel, CoverflowCarouselStrategy } from '@theredhead/lucid-kit';

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
    { name: 'Whiskers', url: 'https://picsum.photos/seed/carousel1/240/240' },
    { name: 'Mittens',  url: 'https://picsum.photos/seed/carousel2/240/240' },
    { name: 'Shadow',   url: 'https://picsum.photos/seed/carousel3/240/240' },
  ];
  readonly strategy = new CoverflowCarouselStrategy({
    peekOffset: 58,
    stackGap: 25,
    rotateY: 70,
    sideScale: 0.85,
    depthOffset: 100,
    blur: true,
  });
  readonly active = signal(1);
}
