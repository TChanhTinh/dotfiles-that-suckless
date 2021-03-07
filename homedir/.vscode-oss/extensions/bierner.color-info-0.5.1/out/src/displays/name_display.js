"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Displays the name of a color.
 */
exports.default = new class NameDisplay {
    constructor() {
        this.name = 'css-color-name';
    }
    display(match) {
        const name = match.color.toName();
        return name ? name : null;
    }
}();
//# sourceMappingURL=name_display.js.map