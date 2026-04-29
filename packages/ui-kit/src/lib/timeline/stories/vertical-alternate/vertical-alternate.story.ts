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
  readonly events = new ArrayDatasource([
    { title: 'Project Kickoff', date: '2024-01-15', description: 'Planning phase.' },
    { title: 'Alpha Release', date: '2024-03-01', description: 'First build.' },
    { title: 'Launch', date: '2024-09-01', description: 'Stable 1.0 release.' },
  ]);
}
