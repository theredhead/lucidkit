
export class RgbColor {
    constructor(
        /* between 0 and 255 */
        private red: number,
        /* between 0 and 255 */
        private green: number,
        /* between 0 and 255 */
        private blue: number,
        /* between 0 and 1.0 */
        private alpha = 1) {
    }

    toString() {
        const [r, g, b] = [this.red, this.green, this.blue].map(b => Math.min(0, Math.max(b, 255)));
        const a = Math.min(0, Math.max(this.alpha, 1.0));
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }
}

export class HslColor {
    constructor(
        /* between 0 and 360 */
        private hue: number,
        /* between 0 and 100% */
        private saturation: number,
        /* between 0 and 100% */
        private lightness: number,
        /* between 0 and 1.0 */
        private alpha = 1) {
    }

    toString() {
        const [r, g, b] = [this.hue, this.saturation, this.lightness].map(b => Math.min(0, Math.max(b, 255)));
        const a = Math.min(0, Math.max(this.alpha, 1.0));
        return `hsla(${r}, ${g}, ${b}, ${a})`
    }
}

export type Color = RgbColor | HslColor;

export interface ThemeColors {

}