import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import { provideMediaEmbedProviders } from "../../media-player.providers";
import type {
  MediaEmbedConfig,
  MediaEmbedProvider,
  MediaSource,
} from "../../media-player.types";

/**
 * Example custom embed provider for Internet Archive.
 *
 * Matches URLs like: `https://archive.org/details/IDENTIFIER`
 */
const archiveOrgProvider: MediaEmbedProvider = {
  name: "Internet Archive",

  resolve(url: string): MediaEmbedConfig | null {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith("archive.org")) return null;
      const match = parsed.pathname.match(/^\/details\/([^/?]+)/);
      if (!match) return null;
      return {
        iframeSrc: `https://archive.org/embed/${match[1]}`,
        providerName: "Internet Archive",
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
  providers: [...provideMediaEmbedProviders(archiveOrgProvider)],
  templateUrl: "./custom-provider.story.html",
  styleUrl: "./custom-provider.story.scss",
})
export class CustomProviderStorySource {
  public readonly videoSource: MediaSource = {
    // Big Buck Bunny — Creative Commons licensed, hosted on Internet Archive
    url: "https://archive.org/details/BigBuckBunny_124",
  };
}
