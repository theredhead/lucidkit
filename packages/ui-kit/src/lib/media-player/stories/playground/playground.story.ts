import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="video"
      [source]="videoSource"
      poster="/assets/poster.jpg"
      ariaLabel="My video"
    />
  \`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://example.com/video.mp4',
    type: 'video/mp4',
  };
}
