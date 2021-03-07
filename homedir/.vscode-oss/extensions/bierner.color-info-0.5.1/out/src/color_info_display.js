"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alpha_display_1 = require("./displays/alpha_display");
const cmyk_display_1 = require("./displays/cmyk_display");
const hex_display_1 = require("./displays/hex_display");
const hsl_display_1 = require("./displays/hsl_display");
const hsv_display_1 = require("./displays/hsv_display");
const lab_display_1 = require("./displays/lab_display");
const name_display_1 = require("./displays/name_display");
const preview_display_1 = require("./displays/preview_display");
const rgb_display_1 = require("./displays/rgb_display");
const allFields = [
    preview_display_1.Preview, preview_display_1.PreviewXL, preview_display_1.PreviewSquare, preview_display_1.PreviewSquareXL,
    rgb_display_1.default,
    hsl_display_1.default,
    hsv_display_1.default,
    cmyk_display_1.default,
    lab_display_1.default,
    alpha_display_1.default,
    hex_display_1.default,
    name_display_1.default,
].reduce((p, display) => {
    p.set(display.name, display);
    return p;
}, new Map());
const defaultFields = [
    preview_display_1.Preview.name,
    rgb_display_1.default.name,
    hsl_display_1.default.name,
    cmyk_display_1.default.name,
    hex_display_1.default.name,
    alpha_display_1.default.name,
];
/**
 * Normalize the name of a color field
 */
const normalizeFieldName = (name) => ('' + name).toLowerCase();
class ColorDisplay {
    constructor(config) {
        this._config = config;
    }
    display(colorMatch) {
        const display = this.getDisplay(colorMatch);
        if (display && display.length) {
            return display;
        }
        return null;
    }
    getDisplays() {
        let fields = (this._config.get('fields') || defaultFields).map(normalizeFieldName);
        const excluded = (this._config.get('excludedFields') || []).map(normalizeFieldName);
        fields = fields.filter((name) => excluded.indexOf(name) === -1);
        return fields
            .map((x) => allFields.get(x))
            .filter((x) => x);
    }
    getDisplay(match) {
        return this.getDisplays().map((x) => x.display(match))
            .filter((x) => x && x.length > 0)
            .join('\n\n');
    }
}
exports.ColorDisplay = ColorDisplay;
//# sourceMappingURL=color_info_display.js.map