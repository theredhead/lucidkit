import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  signal,
} from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-blob-source-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./blob-source.story.html",
  styleUrl: "./blob-source.story.scss",
})
export class BlobSourceStorySource {
  public readonly blobSource = signal<MediaSource | null>(null);

  public constructor() {
    afterNextRender(() => {
      fetch("/media/sample.m4a")
        .then((r) => r.blob())
        .then((blob) => this.blobSource.set({ blob, type: "audio/mp4" }));
    });
  }
}
