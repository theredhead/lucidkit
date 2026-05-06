import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcon } from "@theredhead/lucid-kit";

interface CustomIcon {
  readonly name: string;
  readonly svg: string;
  readonly cssClass?: string;
}

@Component({
  selector: "ui-story-icon-custom-icons",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./custom-icons.story.html",
  styleUrl: "./custom-icons.story.scss",
})
export class CustomIconsStorySource {
  protected readonly customIcons: readonly CustomIcon[] = [
    {
      name: "Diamond",
      svg: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />`,
    },
    {
      name: "Spark",
      svg: `<path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5Z" />`,
    },
    {
      name: "Crosshair",
      svg: `<circle cx="12" cy="12" r="8" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><circle cx="12" cy="12" r="2" />`,
    },
    {
      name: "Lightning",
      svg: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />`,
    },
    {
      name: "Heart (filled)",
      svg: `<path fill="currentColor" stroke="none" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />`,
      cssClass: "heart",
    },
    {
      name: "Waves",
      svg: `<path d="M2 6c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 12c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 18c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" />`,
    },
  ];
}
