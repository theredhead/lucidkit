import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource, MediaTrack } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player
      type="video"
      [source]="videoSource"
      [tracks]="subtitles"
      poster="/assets/movie-poster.jpg"
    />
  \`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: '/assets/movie.mp4',
    type: 'video/mp4',
  };
  readonly subtitles: MediaTrack[] = [
    { kind: 'subtitles', src: '/subs/en.vtt', srcLang: 'en', label: 'English', default: true },
    { kind: 'subtitles', src: '/subs/fr.vtt', srcLang: 'fr', label: 'French' },
  ];
}
