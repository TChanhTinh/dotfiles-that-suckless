"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert = require("color-convert");
const display_helper_1 = require("./display_helper");
/**
 * Displays the CMYK value of a color.
 */
exports.default = new class CmykDisplay {
    constructor() {
        this.name = 'cmyk';
    }
    display(match) {
        const { h, s, l } = match.color.toHsl();
        const [c, m, y, k] = convert.hsl.cmyk([h, s * 100, l * 100]);
        return display_helper_1.func('cmyk', display_helper_1.percent(c, 5), display_helper_1.percent(m, 5), display_helper_1.percent(y, 5), display_helper_1.percent(k, 5));
    }
}();
//# sourceMappingURL=cmyk_display.js.map