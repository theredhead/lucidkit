import { Component } from '@angular/core';
import { UITimeline, type TimelineComponentResolver } from '@theredhead/lucid-kit';
import { ArrayDatasource } from '@theredhead/lucid-foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  template: \`
    <ui-timeline [datasource]="events" [withComponent]="resolver" />
  \`,
})
export class ExampleComponent {
  readonly events = new ArrayDatasource(myEvents);

  readonly resolver: TimelineComponentResolver<MyEvent> = (event) => {
    switch (event.type) {
      case 'milestone': return MilestoneCard;
      case 'release':   return ReleaseCard;
      default:          return DefaultCard;
    }
  };
}
