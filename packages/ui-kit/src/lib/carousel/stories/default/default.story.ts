import { Component, signal } from '@angular/core';
import { UICarousel, ScrollCarouselStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template: \`
    <ui-carousel
      [items]="photos"
      [showIndicators]="false"
      [wrap]="true"
      [(activeIndex)]="active"
    >
      <ng-template let-photo>
        <img [src]="photo.url" [alt]="photo.name" />
      </ng-template>
    </ui-carousel>
  \`,
})
export class ExampleComponent {
  readonly photos = Array.from({ length: 50 }, (_, i) => ({
    name: 'Photo ' + (i + 1),
    url: 'https://picsum.photos/seed/carousel' + (i + 1) + '/280/200',
  }));
  readonly strategy = new ScrollCarouselStrategy();
  readonly active = signal(25);
}
