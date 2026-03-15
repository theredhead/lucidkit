import { TestBed } from "@angular/core/testing";

import {
  DEFAULT_THEME_CONFIG,
  THEME_CONFIG,
  type ThemeConfig,
} from "./theme.tokens";

describe("theme.tokens", () => {
  describe("DEFAULT_THEME_CONFIG", () => {
    it("should have system as default mode", () => {
      expect(DEFAULT_THEME_CONFIG.defaultMode).toBe("system");
    });

    it("should use theredhead-theme-mode as storage key", () => {
      expect(DEFAULT_THEME_CONFIG.storageKey).toBe("theredhead-theme-mode");
    });

    it("should use dark-theme as dark mode class", () => {
      expect(DEFAULT_THEME_CONFIG.darkModeClass).toBe("dark-theme");
    });

    it("should use light-theme as light mode class", () => {
      expect(DEFAULT_THEME_CONFIG.lightModeClass).toBe("light-theme");
    });
  });

  describe("THEME_CONFIG injection token", () => {
    it("should provide default config via factory", () => {
      TestBed.configureTestingModule({});
      const config = TestBed.inject(THEME_CONFIG);

      expect(config).toEqual(DEFAULT_THEME_CONFIG);
    });

    it("should allow overriding with custom config", () => {
      const custom: ThemeConfig = {
        defaultMode: "dark",
        storageKey: "my-theme",
        darkModeClass: "my-dark",
        lightModeClass: "my-light",
      };

      TestBed.configureTestingModule({
        providers: [{ provide: THEME_CONFIG, useValue: custom }],
      });

      const config = TestBed.inject(THEME_CONFIG);
      expect(config).toEqual(custom);
    });
  });
});
