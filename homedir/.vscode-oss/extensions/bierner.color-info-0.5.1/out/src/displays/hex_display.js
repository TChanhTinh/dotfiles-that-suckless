"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_helper_1 = require("./display_helper");
/**
 * Displays the hex value of the color.
 */
exports.default = new class HexDisplay {
    constructor() {
        this.name = 'hex';
    }
    display(match) {
        const hex = match.color.toHexString();
        return display_helper_1.number(hex, 0);
    }
}();
//# sourceMappingURL=hex_display.js.map