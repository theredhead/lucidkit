import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  MediaEmbedProvider,
  MediaEmbedConfig,
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
  vimeoEmbedProvider,
} from '@theredhead/lucid-kit';

// 1. Implement the MediaEmbedProvider interface
const peertubeProvider: MediaEmbedProvider = {
  name: 'PeerTube',
  resolve(url: string): MediaEmbedConfig | null {
    try {
      const parsed = new URL(url);
      const match = parsed.pathname.match(/\/w\/([a-zA-Z0-9-]+)/);
      if (match) {
        return {
          iframeSrc: \`https://\${parsed.hostname}/videos/embed/\${match[1]}\`,
          providerName: 'PeerTube',
        };
      }
    } catch { /* ignore */ }
    return null;
  },
};

// 2. Register providers in your app config
// provideMediaEmbedProviders(
//   youTubeEmbedProvider,
//   vimeoEmbedProvider,
//   peertubeProvider,
// )

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="PeerTube video"
    />
  \`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://videos.joinpeertube.org/w/some-video-id',
    type: 'video/mp4',
  };
}
