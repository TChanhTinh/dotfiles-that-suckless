"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_helper_1 = require("./display_helper");
/**
 * Displays the HSL value of a color.
 */
exports.default = new class HslDisplay {
    constructor() {
        this.name = 'hsl';
    }
    display(match) {
        const { h, s, l } = match.color.toHsl();
        return display_helper_1.func('hsl', display_helper_1.deg(h, 5), display_helper_1.decimalPercent(s, 5), display_helper_1.decimalPercent(l, 5));
    }
}();
//# sourceMappingURL=hsl_display.js.map