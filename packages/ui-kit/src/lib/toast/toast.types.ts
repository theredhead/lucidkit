/** Position anchor for the toast container. */
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

/** Severity level controlling the toast color. */
export type ToastSeverity = "info" | "success" | "warning" | "error";

/** Configuration for opening a toast. */
export interface ToastConfig {

  /** The message text to display. */
  message: string;

  /** Optional title shown above the message. */
  title?: string;

  /** Severity level. Defaults to `"info"`. */
  severity?: ToastSeverity;

  /** Auto-dismiss duration in milliseconds. `0` = no auto-dismiss. Defaults to `4000`. */
  duration?: number;

  /** Optional action button label. */
  actionLabel?: string;

  /** Callback invoked when the action button is clicked. */
  actionFn?: () => void;

  /** Screen position. Defaults to `"top-right"`. */
  position?: ToastPosition;
}

/** Runtime state of a single toast instance. */
export interface ToastInstance extends Required<Omit<ToastConfig, "actionFn">> {

  /** Unique ID for tracking. */
  readonly id: string;

  /** The action callback, if any. */
  readonly actionFn?: () => void;

  /** Whether the toast is currently exiting (for animation). */
  exiting: boolean;
}
