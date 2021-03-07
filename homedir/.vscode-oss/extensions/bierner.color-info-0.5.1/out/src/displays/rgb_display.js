"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_helper_1 = require("./display_helper");
const formatNumber = (val) => display_helper_1.number(display_helper_1.clamp(val, 0, 255) + '', 3);
/**
 * Displays the RGB value of a color.
 */
exports.default = new class RgbDisplay {
    constructor() {
        this.name = 'rgb';
    }
    display(match) {
        const { r, g, b } = match.color.toRgb();
        return display_helper_1.func('rgb', formatNumber(r), formatNumber(g), formatNumber(b));
    }
}();
//# sourceMappingURL=rgb_display.js.map