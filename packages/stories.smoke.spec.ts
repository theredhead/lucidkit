/// <reference types="vite/client" />
/**
 * Smoke tests — every Storybook story component must mount without errors.
 *
 * Beyond basic "does not throw", each story is tested for:
 *   1. No Angular errors — a RethrowingErrorHandler surfaces errors that
 *      Angular normally swallows (DI failures, missing tokens, etc.).
 *   2. No console.error calls — catches template compilation errors,
 *      ExpressionChangedAfterItHasBeenChecked violations, and similar
 *      Angular diagnostics that are logged rather than thrown.
 *   3. Non-empty DOM — confirms the component actually rendered output.
 *
 * Story files are discovered via a lazy import.meta.glob using a
 * project-root-relative pattern (/packages/**).
 */

import { ErrorHandler } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import type { Type } from "@angular/core";
import { vi } from "vitest";

// Angular errors that are handled internally get passed to ErrorHandler.
// The default implementation only logs them, which makes tests pass falsely.
// This handler re-throws so Vitest sees the failure.
class RethrowingErrorHandler implements ErrorHandler {
  public handleError(err: unknown): void {
    throw err;
  }
}

const storyLoaders = import.meta.glob<Record<string, unknown>>(
  "/packages/**/*.story.ts",
);

const entries = Object.entries(storyLoaders);

describe("Storybook story smoke tests", () => {
  it(`discovered ${entries.length} story files`, () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  for (const [filePath, load] of entries) {
    const label = filePath.replace(/^\/packages\//, "");

    it(`${label} mounts without error`, async () => {
      const module = await load();

      const components = Object.values(module).filter(
        (val): val is Type<unknown> =>
          typeof val === "function" && val.prototype != null && "ɵcmp" in val,
      );

      // Some story files export only types / constants — skip without failing.
      if (components.length === 0) return;

      for (const StoryComponent of components) {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
          imports: [StoryComponent],
          providers: [
            { provide: ErrorHandler, useClass: RethrowingErrorHandler },
          ],
        }).compileComponents();

        // Spy on console.error and console.warn before change detection.
        // - All console.error calls are treated as failures (Angular logs DI
        //   errors, template errors and ExpressionChanged violations here).
        // - console.warn calls are only treated as failures when they contain
        //   an Angular NG error code (e.g. "NG0100", "NG0201"), which
        //   indicates a framework-level problem rather than an app-level hint.
        const consoleErrors: unknown[][] = [];
        const consoleNgWarnings: unknown[][] = [];

        const errorSpy = vi
          .spyOn(console, "error")
          .mockImplementation((...args) => {
            consoleErrors.push(args);
          });
        const warnSpy = vi
          .spyOn(console, "warn")
          .mockImplementation((...args) => {
            const msg = args.map(String).join(" ");
            if (/NG\d{4}/.test(msg)) consoleNgWarnings.push(args);
          });

        try {
          const fixture = TestBed.createComponent(StoryComponent);

          expect(() => fixture.detectChanges()).not.toThrow();
          expect(fixture.componentInstance).toBeTruthy();
          expect(
            fixture.nativeElement.innerHTML.trim(),
            `${StoryComponent.name} rendered empty DOM`,
          ).not.toBe("");

          const allProblems = [...consoleErrors, ...consoleNgWarnings];
          if (allProblems.length > 0) {
            const messages = allProblems
              .map((a) => a.map(String).join(" "))
              .join("\n");
            throw new Error(
              `${StoryComponent.name} produced errors during render:\n${messages}`,
            );
          }
        } finally {
          errorSpy.mockRestore();
          warnSpy.mockRestore();
        }
      }
    });
  }
});
