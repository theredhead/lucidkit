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
 * log.log("initialised");        // → "MyService: initialised"
 * log.warn("deprecation", [api]); // → "MyService: deprecation" [api]
 * ```
 */
export class Logger {
  public constructor(
    private readonly strategy: ILoggingStrategy,
    private readonly context: string,
  ) {}

  /** Log an informational message. */
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
 * Messages are formatted as `"<context>: <message>"` followed by any
 * additional arguments spread into the console call.
 */
export class ConsoleLoggingStrategy implements ILoggingStrategy {
  /** @inheritdoc */
  public debug(context: string, message: string, args: unknown[]): void {
    console.debug(`${context}: ${message}`, ...args);
  }

  /** @inheritdoc */
  public info(context: string, message: string, args: unknown[]): void {
    console.log(`${context}: ${message}`, ...args);
  }

  /** @inheritdoc */
  public warn(context: string, message: string, args: unknown[]): void {
    console.warn(`${context}: ${message}`, ...args);
  }

  /** @inheritdoc */
  public error(context: string, message: string, args: unknown[]): void {
    console.error(`${context}: ${message}`, ...args);
  }
}
