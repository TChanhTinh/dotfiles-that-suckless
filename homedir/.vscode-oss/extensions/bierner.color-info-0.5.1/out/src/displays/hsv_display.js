"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_helper_1 = require("./display_helper");
/**
 * Displays the HSV value of a color.
 */
exports.default = new class HsvDisplay {
    constructor() {
        this.name = 'hsv';
    }
    display(match) {
        const { h, s, v } = match.color.toHsv();
        return display_helper_1.func('hsv', display_helper_1.deg(h, 5), display_helper_1.decimalPercent(s, 5), display_helper_1.decimalPercent(v, 5));
    }
}();
//# sourceMappingURL=hsv_display.js.map