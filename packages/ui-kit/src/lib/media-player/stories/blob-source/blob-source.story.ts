import { Component, signal } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \`
    <ui-media-player type="audio" [source]="blobSource()" />
  \`,
})
export class ExampleComponent {
  readonly blobSource = signal<MediaSource>({
    blob: myAudioBlob,       // any Blob / File with audio data
    type: 'audio/webm',
  });
}
