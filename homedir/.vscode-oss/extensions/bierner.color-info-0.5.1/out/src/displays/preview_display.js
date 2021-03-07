"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datauri = require('datauri');
/**
 * Displays a preview of a color.
 */
class PreviewDisplay {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
    display(match) {
        const hex = match.color.toHexString();
        const datauri = new Datauri();
        const src = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" style="background-color: white;"
	 width="${this.width}px" height="${this.height}px" viewBox="0 0 ${this.width} ${this.height}" xml:space="preserve">
        <rect width="${this.width}" height="${this.height}" fill="${hex}" fill-opacity="${match.color.getAlpha()}" />
        <polygon points="0,0 ${this.width},0 ${this.width},${this.height}" fill="${hex}" />
        <rect width="${this.width}" height="${this.height}" fill-opacity="0" stroke="gray" strokeWidth="1" />
</svg>`;
        datauri.format('.svg', src);
        return `![](${datauri.content})`;
    }
}
exports.Preview = new PreviewDisplay('preview', 256, 64);
exports.PreviewXL = new PreviewDisplay('preview-xl', 400, 128);
exports.PreviewSquare = new PreviewDisplay('preview-square', 128, 128);
exports.PreviewSquareXL = new PreviewDisplay('preview-square-xl', 256, 256);
//# sourceMappingURL=preview_display.js.map