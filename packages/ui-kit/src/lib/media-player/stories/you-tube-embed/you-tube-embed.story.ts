import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
} from '@theredhead/lucid-kit';

// In your app config or route providers:
// provideMediaEmbedProviders(youTubeEmbedProvider)

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="YouTube video"
    />
  \`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'video/mp4',
  };
}
