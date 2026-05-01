import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { CommandPaletteItem } from "../../command-palette.types";
import { UICommandPalette } from "../../command-palette.component";

const MINIMAL_COMMANDS: readonly CommandPaletteItem[] = [
  { id: "copy", label: "Copy", shortcut: "Cmd+C" },
  { id: "paste", label: "Paste", shortcut: "Cmd+V" },
];

@Component({
  selector: "ui-minimal-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICommandPalette],
  templateUrl: "./minimal.story.html",
  styleUrl: "./minimal.story.scss",
})
export class MinimalStorySource {
  public readonly commands = MINIMAL_COMMANDS;

  private readonly _paletteOpen = signal(false);

  public get paletteOpen(): boolean {
    return this._paletteOpen();
  }

  public set paletteOpen(value: boolean) {
    this._paletteOpen.set(value);
  }
}
