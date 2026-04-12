/**
 * A single action that can be executed from the command palette.
 *
 * @typeParam C - Optional context type carried on the command.
 */
export interface CommandPaletteItem<C = unknown> {

  /** Unique identifier for this command. */
  readonly id: string;

  /** Display label shown in the palette list. */
  readonly label: string;

  /**
   * Optional group name. Commands with the same group are rendered
   * under a shared heading.
   */
  readonly group?: string;

  /**
   * Optional keyboard shortcut hint displayed on the right side
   * (e.g. `"Cmd+S"`, `"Ctrl+Shift+P"`). Purely cosmetic — the
   * palette does not bind these shortcuts.
   */
  readonly shortcut?: string;

  /** Optional SVG icon content (inner `<path>` string for a 24×24 grid). */
  readonly icon?: string;

  /** Whether this command is currently disabled. */
  readonly disabled?: boolean;

  /**
   * Optional keywords that improve search matching beyond the
   * label text.
   */
  readonly keywords?: readonly string[];

  /** Optional arbitrary context payload. */
  readonly context?: C;
}

/**
 * Event emitted when a command is executed from the palette.
 *
 * @typeParam C - Optional context type carried on the command.
 */
export interface CommandExecuteEvent<C = unknown> {

  /** The command that was executed. */
  readonly command: CommandPaletteItem<C>;

  /** ISO-8601 timestamp of when the command was executed. */
  readonly executedAt: string;
}

/**
 * Grouped commands used internally to organise items by group.
 * @internal
 */
export interface CommandGroup<C = unknown> {
  readonly name: string;
  readonly items: readonly CommandPaletteItem<C>[];
}
