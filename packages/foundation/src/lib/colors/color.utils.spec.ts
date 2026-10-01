import { describe, expect, it } from "vitest";

import {
    getContrastingTextColor,
    isCssColor,
    parseCssColor,
} from "./color.utils";

describe("color utilities", () => {
    it("parses hex colors", () => {
        expect(parseCssColor("#3584e4")).toEqual({
            r: 53,
            g: 132,
            b: 228,
            a: 1,
        });
    });

    it("parses rgb and hsl colors", () => {
        expect(parseCssColor("rgb(10, 20, 30)")).toEqual({
            r: 10,
            g: 20,
            b: 30,
            a: 1,
        });
        expect(parseCssColor("hsl(0, 100%, 50%)")).toEqual({
            r: 255,
            g: 0,
            b: 0,
            a: 1,
        });
    });

    it("accepts CSS variable references and rejects malformed colors", () => {
        expect(isCssColor("var(--ui-accent)")).toBe(true);
        expect(isCssColor("#not-a-color")).toBe(false);
        expect(parseCssColor("not-a-color")).toBeNull();
    });

    it("chooses contrasting text", () => {
        expect(getContrastingTextColor("#ffffff")).toBe("#1d232b");
        expect(getContrastingTextColor("#000000")).toBe("#ffffff");
        expect(getContrastingTextColor("var(--ui-accent)")).toBeNull();
    });
});
