import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player type="video" [source]="brokenSource" ariaLabel="Broken video" />
    <ui-media-player type="audio" [source]="brokenSource" ariaLabel="Broken audio" />
  \`,
})
export class ExampleComponent {
  readonly brokenSource: MediaSource = {
    url: '/assets/does-not-exist.mp4',
    type: 'video/mp4',
  };
}
