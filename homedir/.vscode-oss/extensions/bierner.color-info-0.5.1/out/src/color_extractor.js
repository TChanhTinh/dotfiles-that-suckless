"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tinycolor = require('tinycolor2');
/**
 * Extract all matches for a given regular expression on a line
 */
const getRegExForLine = (re, line, lineNumber) => {
    const matches = [];
    let match;
    while ((match = re.exec(line))) {
        const color = tinycolor(match[1]);
        if (color && color.isValid()) {
            const span = new vscode.Range(new vscode.Position(lineNumber, match.index), new vscode.Position(lineNumber, match.index + match[0].length));
            matches.push({
                value: match[0],
                color,
                span,
            });
        }
    }
    return matches;
};
/**
 * Get all `rgb(...)` colors in a line of text.
 */
const rgbExtractor = {
    type: 'rgb',
    getColors(line, position) {
        return getRegExForLine(/(?:\b|^)(rgba?\(.+?\))/g, line, position.line);
    },
};
/**
 * Get all `hsl(...)` colors in a line of text.
 */
const hslExtractor = {
    type: 'hsl',
    getColors(line, position) {
        return getRegExForLine(/(?:\b|^)(hsla?\(.+?\))/g, line, position.line);
    },
};
/**
 * Get all hex colors in a line of text.
 */
const hexExtractor = {
    type: 'hex',
    getColors(line, position) {
        return getRegExForLine(/(?:^|\s|\W)(#(?:[0-9a-fA-F]{3}){1,2})(\b|$)/g, line, position.line);
    },
};
/**
 * Get all hex colors with alpha in a line of text.
 */
const hexaExtractor = {
    type: 'hex+alpha',
    getColors(line, position) {
        return getRegExForLine(/(?:^|\s|\W)(#(?:[0-9a-fA-F]{4}){1,2})(\b|$)/g, line, position.line);
    },
};
/**
 * Extracts named css colors
 */
const cssNameExtractor = {
    type: 'css-color-names',
    getColors(line, position) {
        const colorNameCharacter = /[a-z]/i;
        let right = '';
        for (let i = position.character; i < line.length; ++i) {
            const char = line[i];
            if (!char.match(colorNameCharacter)) {
                break;
            }
            right += char;
        }
        let left = '';
        let leftHead = position.character - 1;
        for (; leftHead >= 0; --leftHead) {
            const char = line[leftHead];
            if (!char.match(colorNameCharacter)) {
                break;
            }
            left = char + left;
        }
        // Make sure not to grab potential hex strings
        if (leftHead > 0 && line[leftHead] === '#') {
            return [];
        }
        leftHead = Math.max(leftHead, 0);
        const word = left + right;
        const color = tinycolor(word);
        if (color && color.isValid()) {
            const span = new vscode.Range(new vscode.Position(position.line, leftHead), new vscode.Position(position.line, leftHead + word.length));
            return [{
                    value: word,
                    color,
                    span,
                }];
        }
        return [];
    },
};
const valueExtractorRegistry = [
    rgbExtractor,
    hslExtractor,
    hexExtractor,
    hexaExtractor,
    cssNameExtractor,
].reduce((registry, extractor) => {
    registry[extractor.type] = extractor;
    return registry;
}, {});
/**
 * Extracts color values from text
 */
class ColorExtractor {
    constructor(valueExtractorTypes) {
        this._valueExtractors = new Set();
        for (const t of valueExtractorTypes) {
            const extractor = valueExtractorRegistry[t];
            if (extractor) {
                this._valueExtractors.add(extractor);
            }
        }
    }
    getColorAtPosition(line, position) {
        const allColors = this.getColorsForLine(position, line)
            .filter((x) => x.span.contains(position));
        return allColors[0];
    }
    /**
     * Get all color values in a line of text.
     */
    getColorsForLine(position, line) {
        const matches = [];
        for (const valueExtractor of this._valueExtractors) {
            matches.push(...valueExtractor.getColors(line, position));
        }
        return matches;
    }
}
exports.ColorExtractor = ColorExtractor;
//# sourceMappingURL=color_extractor.js.map