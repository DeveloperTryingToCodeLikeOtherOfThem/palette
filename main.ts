// adapted from libs/screen/imageconverter.ts

namespace image {
    /**
     * Color-aware image that converts to standard Image for display
     */
    export class ColorfulImage {
        width: number;
        height: number;
        pixels: number[];  // Store as 0xRRGGBB
        __type__ = "ColorfulImage";

        constructor(w: number, h: number) {
            this.width = w | 0;
            this.height = h | 0;
            this.pixels = [];

            for (let i = 0; i < w * h; i++) {
                this.pixels[i] = 0x000000;
            }
        }

        setPixel(x: number, y: number, color: number): void {
            x = x | 0;
            y = y | 0;

            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return;
            }

            this.pixels[y * this.width + x] = color & 0xFFFFFF;
        }

        getPixel(x: number, y: number): number {
            x = x | 0;
            y = y | 0;

            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return 0;
            }

            return this.pixels[y * this.width + x];
        }

        fill(color: number): void {
            color = color & 0xFFFFFF;
            for (let i = 0; i < this.pixels.length; i++) {
                this.pixels[i] = color;
            }
        }

        fillRect(x: number, y: number, w: number, h: number, color: number): void {
            x = x | 0;
            y = y | 0;
            w = w | 0;
            h = h | 0;
            color = color & 0xFFFFFF;

            for (let py = y; py < y + h && py < this.height; py++) {
                for (let px = x; px < x + w && px < this.width; px++) {
                    this.pixels[py * this.width + px] = color;
                }
            }
        }

        drawLine(x0: number, y0: number, x1: number, y1: number, color: number): void {
            x0 = x0 | 0;
            y0 = y0 | 0;
            x1 = x1 | 0;
            y1 = y1 | 0;
            color = color & 0xFFFFFF;

            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = x0 < x1 ? 1 : -1;
            const sy = y0 < y1 ? 1 : -1;
            let err = dx - dy;

            let x = x0;
            let y = y0;

            while (true) {
                this.setPixel(x, y, color);

                if (x === x1 && y === y1) break;

                const e2 = 2 * err;
                if (e2 > -dy) {
                    err -= dy;
                    x += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y += sy;
                }
            }
        }
    }

    /**
     * Create colorful image with RGB support
     */
    //% blockNamespace="images" group="Create"
    //% block="create colorful image $width x $height"
    export function createColorfulImage(width: number, height: number): ColorfulImage {
        width = width | 0;
        height = height | 0;

        if (width <= 0 || width > 2000 || height <= 0 || height > 2000) {
            return null;
        }

        return new ColorfulImage(width, height);
    }

    /**
     * Convert colorful image to standard Image for display
     * Maps RGB colors to nearest palette indices
     */
    //% blockNamespace="images" group="Drawing"
    //% block="convert $src to standard image with palette"
    export function toStandardImage(src: ColorfulImage): Image {
        if (!src) return null;

        // Create standard image
        const dest = image.create(src.width, src.height);

        // Get current screen palette colors
        const paletteColors = _getScreenPaletteColors();

        // Convert each pixel to closest palette index
        for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
                const rgbColor = src.getPixel(x, y);

                if (rgbColor !== 0x000000) {  // Skip black as background
                    const paletteIdx = _findClosestPaletteIndex(rgbColor, paletteColors);
                    dest.setPixel(x, y, paletteIdx);
                }
            }
        }

        return dest;
    }

    /**
     * Draw colorful image directly to screen
     * Automatically converts when rendering
     */
    //% blockNamespace="images" group="Drawing"
    //% block="draw colorful $src to screen at $x $y"
    export function drawColorful(screen: Image, src: ColorfulImage, x: number, y: number): void {
        x = x | 0;
        y = y | 0;

        if (!screen || !src) return;

        // Convert and draw in one step
        const converted = toStandardImage(src);
        screen.drawImage(converted, x, y);
    }

    /**
     * Set the active palette for color conversion
     * Call this once before drawing colorful images
     */
    //% blockNamespace="images" group="Screen"
    //% block="set palette for drawing $colors"
    export function setDrawingPalette(colors: number[]): void {
        if (!colors || colors.length < 2 || colors.length > 16) {
            return;
        }

        _colorfulImagePalette = colors.slice();

        // Apply to screen palette
        const buf = control.createBuffer(colors.length * 3);
        for (let i = 0; i < colors.length; i++) {
            const hex = colors[i] & 0xFFFFFF;
            buf[i * 3 + 0] = (hex >> 16) & 0xFF;
            buf[i * 3 + 1] = (hex >> 8) & 0xFF;
            buf[i * 3 + 2] = (hex >> 0) & 0xFF;
        }

        image.setPalette(buf);
    }

    // ========== Internal ==========

    let _colorfulImagePalette: number[] = [
        0x000000, 0xFF0000, 0x00FF00, 0x0000FF,
        0xFFFF00, 0xFF00FF, 0x00FFFF, 0xFFFFFF,
        0x808080, 0xC0C0C0, 0x800000, 0x008000,
        0x000080, 0x808000, 0x800080, 0x008080
    ];

    function _getScreenPaletteColors(): number[] {
        return _colorfulImagePalette;
    }

    function _findClosestPaletteIndex(color: number, palette: number[]): number {
        color = color & 0xFFFFFF;

        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = (color >> 0) & 0xFF;

        let bestIdx = 0;
        let bestDist = 999999;

        for (let i = 0; i < palette.length; i++) {
            const pColor = palette[i] & 0xFFFFFF;
            const pr = (pColor >> 16) & 0xFF;
            const pg = (pColor >> 8) & 0xFF;
            const pb = (pColor >> 0) & 0xFF;

            const dr = r - pr;
            const dg = g - pg;
            const db = b - pb;

            const dist = dr * dr + dg * dg + db * db;

            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
            }
        }

        return bestIdx;
    }
}
