import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player #player type="video" [source]="src" poster="/assets/poster.jpg" [controls]="false" />
    <button (click)="player.playMedia()">Play</button>
    <button (click)="player.pauseMedia()">Pause</button>
  \`,
})
export class ExampleComponent {
  readonly src: MediaSource = { url: '/video.mp4', type: 'video/mp4' };
}
