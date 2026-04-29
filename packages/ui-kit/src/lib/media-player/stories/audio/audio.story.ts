import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="audio"
      [source]="audioSource"
      ariaLabel="Podcast episode"
    />
  \`,
})
export class ExampleComponent {
  readonly audioSource: MediaSource = {
    url: '/assets/episode.mp3',
    type: 'audio/mpeg',
  };
}
