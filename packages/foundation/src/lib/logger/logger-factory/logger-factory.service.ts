import { Injectable } from "@angular/core";

import {
  ConsoleLoggingStrategy,
  Logger,
  type ILoggingStrategy,
} from "../logger";

/**
 * Angular service that creates context-scoped {@link Logger} instances.
 *
 * Inject `LoggerFactory` wherever you need a logger and call
 * {@link createLogger} with a context string (typically the class name).
 * A {@link ConsoleLoggingStrategy} is used by default, but you can
 * supply any {@link ILoggingStrategy} to redirect output.
 *
 * @example
 * ```ts
 * export class MyComponent {
 *   private readonly log = inject(LoggerFactory).createLogger("MyComponent");
 *
 *   public ngOnInit(): void {
 *     this.log.log("component initialised");
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: "root" })
export class LoggerFactory {
  /**
   * Creates a new {@link Logger} bound to the given context.
   *
   * @param context  A label prepended to every log message (e.g. a
   *                 class name or feature area).
   * @param strategy The logging back-end to use.  Defaults to
   *                 {@link ConsoleLoggingStrategy}.
   * @returns A ready-to-use `Logger` instance.
   */
  public createLogger(
    context: string,
    strategy: ILoggingStrategy = new ConsoleLoggingStrategy(),
  ): Logger {
    return new Logger(strategy, context);
  }
}
