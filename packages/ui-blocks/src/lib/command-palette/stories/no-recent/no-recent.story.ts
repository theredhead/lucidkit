import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { CommandPaletteItem } from "../../command-palette.types";
import { UICommandPalette } from "../../command-palette.component";

const COMMANDS_WITHOUT_RECENTS: readonly CommandPaletteItem[] = [
  {
    id: "open-reports",
    label: "Open Reports",
    group: "Navigation",
    keywords: ["analytics", "dashboards"],
  },
  {
    id: "share-link",
    label: "Copy Share Link",
    group: "Actions",
    shortcut: "Cmd+Shift+C",
  },
  {
    id: "export-pdf",
    label: "Export as PDF",
    group: "Actions",
  },
];

@Component({
  selector: "ui-no-recent-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICommandPalette],
  templateUrl: "./no-recent.story.html",
  styleUrl: "./no-recent.story.scss",
})
export class NoRecentStorySource {
  public readonly commands = COMMANDS_WITHOUT_RECENTS;

  private readonly _paletteOpen = signal(false);

  public get paletteOpen(): boolean {
    return this._paletteOpen();
  }

  public set paletteOpen(value: boolean) {
    this._paletteOpen.set(value);
  }

  public onExecute(_event: unknown): void {
    this.paletteOpen = false;
  }
}
