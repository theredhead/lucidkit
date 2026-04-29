import { Component } from '@angular/core';
import { UITimeline } from '@theredhead/lucid-kit';
import { ArrayDatasource } from '@theredhead/lucid-foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly events = new ArrayDatasource(myEvents);
}
