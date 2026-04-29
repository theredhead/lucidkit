import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  provideMediaEmbedProviders,
  vimeoEmbedProvider,
} from '@theredhead/lucid-kit';

// In your app config or route providers:
// provideMediaEmbedProviders(vimeoEmbedProvider)

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="Vimeo video"
    />
  \`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://vimeo.com/76979871',
    type: 'video/mp4',
  };
}
