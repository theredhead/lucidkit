import { compileString } from "sass";

function compileTheme(): string {
    return compileString(
        `
      @use "generative" as gen;
      @include gen.lucid-theme(
        $primary: #ffff00,
        $success: #00ff00,
        $error: #0000ff,
      );
    `,
        { loadPaths: ["packages/ui-theme/src/lib/styles"] },
    ).css;
}

describe("generative theme contrast", () => {
    it("should choose foregrounds using relative luminance contrast", () => {
        const css = compileTheme();

        expect(css).toContain("--ui-accent-contrast: #14161a");
        expect(css).toContain("--ui-on-success: #14161a");
        expect(css).toContain("--ui-on-error: #ffffff");
    });
});
