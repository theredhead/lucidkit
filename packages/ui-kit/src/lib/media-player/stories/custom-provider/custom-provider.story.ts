import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import { provideMediaEmbedProviders } from "../../media-player.providers";
import type {
  MediaEmbedConfig,
  MediaEmbedProvider,
  MediaSource,
} from "../../media-player.types";

/**
 * Example custom embed provider for PeerTube instances.
 *
 * Matches URLs like: `https://peertube.video/videos/watch/VIDEO_ID`
 */
const peerTubeProvider: MediaEmbedProvider = {
  name: "PeerTube",

  resolve(url: string): MediaEmbedConfig | null {
    try {
      const parsed = new URL(url);
      const match = parsed.pathname.match(/^\/videos\/watch\/([^/?]+)/);
      if (!match) return null;
      return {
        iframeSrc: `${parsed.origin}/videos/embed/${match[1]}`,
        providerName: "PeerTube",
        aspectRatio: "16 / 9",
      };
    } catch {
      return null;
    }
  },
};

@Component({
  selector: "ui-custom-provider-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  providers: [...provideMediaEmbedProviders(peerTubeProvider)],
  templateUrl: "./custom-provider.story.html",
  styleUrl: "./custom-provider.story.scss",
})
export class CustomProviderStorySource {
  public readonly videoSource: MediaSource = {
    url: "https://peertube.video/videos/watch/9c9de5e8-0a1e-484a-b099-e80766180a6d",
  };
}
