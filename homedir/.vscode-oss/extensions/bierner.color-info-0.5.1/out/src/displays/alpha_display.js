"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_helper_1 = require("./display_helper");
/**
 * Displays the alpha value
 */
exports.default = new class AlphaDisplay {
    constructor() {
        this.name = 'alpha';
    }
    display(match) {
        const { a } = match.color.toRgb();
        return display_helper_1.func('alpha', display_helper_1.decimalPercent(a, 0));
    }
}();
//# sourceMappingURL=alpha_display.js.map