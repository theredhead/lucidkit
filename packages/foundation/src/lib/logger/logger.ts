/**
 * Strategy interface for log output.
 *
 * Implement this interface to redirect log messages to a remote
 * service, an in-memory buffer, or any other sink. The default
 * implementation ({@link ConsoleLoggingStrategy}) writes to the
 * browser console.
 */
export interface ILoggingStrategy {

  /** Emit an debug message. */
  debug(context: string, message: string, args: unknown[]): void;

  /** Emit an informational message. */
  info(context: string, message: string, args: unknown[]): void;

  /** Emit a warning. */
  warn(context: string, message: string, args: unknown[]): void;

  /** Emit an error. */
  error(context: string, message: string, args: unknown[]): void;
}

/**
 * Lightweight, context-scoped logger.
 *
 * Each `Logger` instance is bound to a **context** string (typically
 * the class or feature name) and a pluggable {@link ILoggingStrategy}.
 * The context is automatically prepended to every message so that log
 * output is easy to filter.
 *
 * @example
 * ```ts
 * const log = new Logger(new ConsoleLoggingStrategy(), "MyService");
 * log.info("initialised");        // → "[2026-03-23T12:00:00.000Z] MyService: initialised"
 * log.warn("deprecation", [api]); // → "[2026-03-23T12:00:00.000Z] MyService: deprecation" [api]
 * ```
 */
export class Logger {
  public constructor(
    private readonly strategy: ILoggingStrategy,
    private readonly context: string,
  ) {}

  /** Log a debug-level message. */
  public debug(message: string, args: unknown[] = []): void {
    this.strategy.debug(this.context, message, args);
  }

  /** Log an informational message. */
  public info(message: string, args: unknown[] = []): void {
    this.strategy.info(this.context, message, args);
  }

  /** Log a warning. */
  public warn(message: string, args: unknown[] = []): void {
    this.strategy.warn(this.context, message, args);
  }

  /** Log an error. */
  public error(message: string, args: unknown[] = []): void {
    this.strategy.error(this.context, message, args);
  }
}

/**
 * Default {@link ILoggingStrategy} that delegates to the browser
 * `console`.
 *
 * Messages are formatted as
 * `"[<ISO-timestamp>] <context>: <message>"` followed by any
 * additional arguments spread into the console call.
 */
export class ConsoleLoggingStrategy implements ILoggingStrategy {

  /** @inheritdoc */
  public debug(context: string, message: string, args: unknown[]): void {
    console.debug(
      `[${new Date().toISOString()}] ${context}: ${message}`,
      ...args,
    );
  }

  /** @inheritdoc */
  public info(context: string, message: string, args: unknown[]): void {
    console.info(
      `[${new Date().toISOString()}] ${context}: ${message}`,
      ...args,
    );
  }

  /** @inheritdoc */
  public warn(context: string, message: string, args: unknown[]): void {
    console.warn(
      `[${new Date().toISOString()}] ${context}: ${message}`,
      ...args,
    );
  }

  /** @inheritdoc */
  public error(context: string, message: string, args: unknown[]): void {
    console.error(
      `[${new Date().toISOString()}] ${context}: ${message}`,
      ...args,
    );
  }
}
