import type { FileBrowserDatasource, FileBrowserEntry } from "../file-browser";

/** Variant for the confirm dialog's primary action button. */
export type ConfirmVariant = "primary" | "danger" | "warning";

// ── Alert ──────────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.alert}. */
export interface AlertOptions {
  /** Dialog title. */
  readonly title: string;

  /** Message body (plain text or a single paragraph). */
  readonly message: string;

  /** Label for the dismiss button. Defaults to `"OK"`. */
  readonly buttonLabel?: string;

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}

// ── Confirm ────────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.confirm}. */
export interface ConfirmOptions {
  /** Dialog title. */
  readonly title: string;

  /** Message body. */
  readonly message: string;

  /** Label for the confirm button. Defaults to `"OK"`. */
  readonly confirmLabel?: string;

  /** Label for the cancel button. Defaults to `"Cancel"`. */
  readonly cancelLabel?: string;

  /** Visual variant of the confirm button. Defaults to `"primary"`. */
  readonly variant?: ConfirmVariant;

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}

// ── Prompt ─────────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.prompt}. */
export interface PromptOptions {
  /** Dialog title. */
  readonly title: string;

  /** Message body displayed above the input. */
  readonly message: string;

  /** Default value pre-filled in the input. */
  readonly defaultValue?: string;

  /** Placeholder text for the input. */
  readonly placeholder?: string;

  /** Label for the OK button. Defaults to `"OK"`. */
  readonly okLabel?: string;

  /** Label for the cancel button. Defaults to `"Cancel"`. */
  readonly cancelLabel?: string;

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}

// ── Open file ──────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.openFile}. */
export interface OpenFileOptions<M = unknown> {
  /** Datasource powering the file browser. */
  readonly datasource: FileBrowserDatasource<M>;

  /** Dialog title. Defaults to `"Open File"`. */
  readonly title?: string;

  /** Whether the user may select multiple files. */
  readonly allowMultiple?: boolean;

  /** Label for the open button. Defaults to `"Open"`. */
  readonly openLabel?: string;

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}

/** Result returned by {@link CommonDialogService.openFile}. */
export interface OpenFileResult<M = unknown> {
  /** The selected file(s). */
  readonly files: readonly FileBrowserEntry<M>[];
}

// ── Save file ──────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.saveFile}. */
export interface SaveFileOptions<M = unknown> {
  /** Datasource powering the file browser. */
  readonly datasource: FileBrowserDatasource<M>;

  /** Dialog title. Defaults to `"Save File"`. */
  readonly title?: string;

  /** Pre-filled file name. */
  readonly defaultName?: string;

  /** Label for the save button. Defaults to `"Save"`. */
  readonly saveLabel?: string;

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}

/** Result returned by {@link CommonDialogService.saveFile}. */
export interface SaveFileResult<M = unknown> {
  /** The directory path the user is currently browsing. */
  readonly directory: FileBrowserEntry<M> | null;

  /** The file name entered by the user. */
  readonly name: string;
}

// ── About ──────────────────────────────────────────────────────────

/** Options for {@link CommonDialogService.about}. */
export interface AboutOptions {
  /** Application name. */
  readonly appName: string;

  /** Version string (e.g. `"1.2.3"`). */
  readonly version?: string;

  /** Short description or tagline. */
  readonly description?: string;

  /** URL or data-URI for a logo image. */
  readonly logoUrl?: string;

  /** Copyright notice (e.g. `"© 2026 Acme Corp"`). */
  readonly copyright?: string;

  /** Credits / acknowledgements — rendered as a list. */
  readonly credits?: readonly string[];

  /** Accessible label for the dialog element. */
  readonly ariaLabel?: string;
}
