import { TestBed } from "@angular/core/testing";

import { ThemeStudioService } from "./theme-studio.service";
import type { ThemeTokenState } from "./theme-studio.types";

describe("ThemeStudioService", () => {
  let service: ThemeStudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeStudioService);
    service.tokens.set([
      {
        name: "--ui-accent",
        description: "Accent colour",
        type: "color",
        scope: "global",
        namespace: "ui",
        values: { light: "#123456" },
        computedValue: "#123456",
        override: null,
      },
      {
        name: "--cp-bg",
        description: "Command palette surface",
        type: "color",
        scope: "component",
        namespace: "cp",
        values: { light: "#ffffff" },
        definitions: [{ file: "command-palette.scss", line: 1, owner: "UICommandPalette", package: "ui-blocks", mode: "all" }],
        computedValue: "#ffffff",
        override: null,
      },
    ] satisfies ThemeTokenState[]);
  });

  it("applies and resets a root token override", () => {
    service.setOverride("--ui-accent", "#abcdef");

    expect(document.documentElement.style.getPropertyValue("--ui-accent")).toBe("#abcdef");
    expect(service.modifiedTokens().map((token) => token.name)).toEqual(["--ui-accent"]);

    service.resetAll();

    expect(document.documentElement.style.getPropertyValue("--ui-accent")).toBe("");
    expect(service.modifiedTokens()).toEqual([]);
  });

  it("imports only known overrides", () => {
    service.importOverrides({ "--ui-accent": "#fedcba", "--unknown": "red" });

    expect(service.exportJson()).toEqual({ "--ui-accent": "#fedcba" });
  });

  it("filters component tokens for the selected sample", () => {
    service.setSelectedSample("button");
    service.setSampleTokensOnly(true);

    expect(service.filteredTokens().map((token) => token.name)).toEqual([]);

    service.setSelectedSample("overview");
    expect(service.filteredTokens().map((token) => token.name)).toEqual([
      "--ui-accent",
      "--cp-bg",
    ]);
  });
});
