"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert = require('color-convert');
const display_helper_1 = require("./display_helper");
/**
 * Displays the LAB value of a color.
 */
exports.default = new class LabDisplay {
    constructor() {
        this.name = 'lab';
    }
    display(match) {
        const { h, s, l } = match.color.toHsl();
        const lab = convert.hsl.lab(h, s * 100, l * 100);
        return display_helper_1.func('lab', display_helper_1.number(lab[0], 5), display_helper_1.number(lab[1], 5), display_helper_1.number(lab[2], 5));
    }
}();
//# sourceMappingURL=lab_display.js.map