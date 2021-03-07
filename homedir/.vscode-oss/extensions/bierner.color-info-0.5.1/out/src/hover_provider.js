"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * Color info hover provider
 */
class ColorInfoHoverProvider {
    constructor(extractor, display) {
        this._extractor = extractor;
        this._display = display;
    }
    provideHover(document, position, _token) {
        const line = document.lineAt(position.line);
        const match = this._extractor.getColorAtPosition(line.text, position);
        if (match) {
            const display = this._display.display(match);
            if (display) {
                return new vscode.Hover(display);
            }
        }
        return null;
    }
}
exports.default = ColorInfoHoverProvider;
//# sourceMappingURL=hover_provider.js.map