import { Component, signal } from '@angular/core';
import { UICarousel, SingleCarouselStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICarousel],
  template:         <ui-carousel [items]="photos" [strategy]="strategy" [(activeIndex)]="active">
      <ng-template let-photo>
        <div class="frame">
          <img [src]="photo.url" [alt]="photo.name" />
        </div>
      </ng-template>
    </ui-carousel>
      ,
})
export class ExampleComponent {
  readonly photos = [
    { name: 'Whiskers', url: 'https://picsum.photos/seed/carousel1/1200/720' },
    { name: 'Mittens', url: 'https://picsum.photos/seed/carousel2/1200/720' },
    { name: 'Shadow', url: 'https://picsum.photos/seed/carousel3/1200/720' },
  ];
  readonly strategy = new SingleCarouselStrategy();
  readonly active = signal(0);
}
