/** RGBA channels with red, green, and blue in 0-255 and alpha in 0-1. */
export interface ParsedCssColor {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;
}

/** Parse common CSS color syntax into RGBA channels. */
export function parseCssColor(value: string): ParsedCssColor | null {
    const color = value.trim();
    const hex = parseHex(color);
    if (hex) return hex;

    const rgb = color.match(
        /^rgba?\(\s*(\d+(?:\.\d+)?)(?:\s*,\s*|\s+)(\d+(?:\.\d+)?)(?:\s*,\s*|\s+)(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)$/i,
    );
    if (rgb) {
        return {
            r: clamp(Number(rgb[1]), 0, 255),
            g: clamp(Number(rgb[2]), 0, 255),
            b: clamp(Number(rgb[3]), 0, 255),
            a: clamp(rgb[4] === undefined ? 1 : Number(rgb[4]), 0, 1),
        };
    }

    const hsl = color.match(
        /^hsla?\(\s*(-?\d+(?:\.\d+)?)(?:deg)?\s*[, ]\s*(\d+(?:\.\d+)?)%\s*[, ]\s*(\d+(?:\.\d+)?)%(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)$/i,
    );
    if (hsl) {
        return hslToRgba(
            Number(hsl[1]),
            Number(hsl[2]),
            Number(hsl[3]),
            hsl[4] === undefined ? 1 : Number(hsl[4]),
        );
    }

    return parseNamedCssColor(color);
}

/** Return whether a value is a usable CSS color or CSS custom-property reference. */
export function isCssColor(value: string): boolean {
    const color = value.trim();
    if (!color) return false;
    if (/^var\(--[a-z0-9-]+\)$/i.test(color)) return true;
    if (/^(currentcolor|transparent)$/i.test(color)) return true;
    return parseCssColor(color) !== null;
}

/** Choose black or white text for readable contrast on a CSS color. */
export function getContrastingTextColor(value: string): string | null {
    const parsed = parseCssColor(value);
    if (!parsed) return null;

    const linear = (channel: number): number => {
        const normalized = channel / 255;
        return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };
    const luminance =
        0.2126 * linear(parsed.r) +
        0.7152 * linear(parsed.g) +
        0.0722 * linear(parsed.b);
    return luminance > 0.179 ? "#1d232b" : "#ffffff";
}

function parseHex(value: string): ParsedCssColor | null {
    const match = value.match(/^#([0-9a-f]{3,8})$/i);
    if (!match) return null;
    const hex = match[1];
    if (![3, 4, 6, 8].includes(hex.length)) return null;
    const expanded = hex.length < 5
        ? hex.split("").map((channel) => channel + channel).join("")
        : hex;
    const channels = expanded.match(/.{2}/g) ?? [];
    return {
        r: parseInt(channels[0]!, 16),
        g: parseInt(channels[1]!, 16),
        b: parseInt(channels[2]!, 16),
        a: channels[3] === undefined ? 1 : parseInt(channels[3]!, 16) / 255,
    };
}

function parseNamedCssColor(value: string): ParsedCssColor | null {
    if (typeof document === "undefined" || !/^[a-z]+$/i.test(value)) return null;
    try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context) return null;
        context.fillStyle = "#000000";
        context.fillStyle = value;
        if (context.fillStyle === "#000000" && value.toLowerCase() !== "black") return null;
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const data = context.getImageData(0, 0, 1, 1).data;
        return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
    } catch {
        return null;
    }
}

function hslToRgba(hue: number, saturation: number, lightness: number, alpha: number): ParsedCssColor {
    const h = ((hue % 360) + 360) % 360 / 360;
    const s = clamp(saturation / 100, 0, 1);
    const l = clamp(lightness / 100, 0, 1);
    if (s === 0) {
        const channel = Math.round(l * 255);
        return { r: channel, g: channel, b: channel, a: clamp(alpha, 0, 1) };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hueChannel(p, q, h + 1 / 3) * 255),
        g: Math.round(hueChannel(p, q, h) * 255),
        b: Math.round(hueChannel(p, q, h - 1 / 3) * 255),
        a: clamp(alpha, 0, 1),
    };
}

function hueChannel(p: number, q: number, value: number): number {
    let channel = value;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}
