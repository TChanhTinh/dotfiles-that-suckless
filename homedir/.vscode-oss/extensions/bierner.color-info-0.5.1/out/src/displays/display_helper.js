"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const padImpl = require("pad");
exports.clamp = (val, min, max) => Math.min(max, Math.max(min, val));
exports.pad = (val, count) => padImpl(count, '' + val, '\u00A0');
exports.number = (val, padding) => '`\u200B' + exports.pad(val, padding + 2) + '`';
exports.unit = (unit, val, padding) => exports.number(val + unit, padding);
exports.percent = (val, padding) => exports.unit('%', +(val).toFixed(2), padding);
exports.decimalPercent = (val, padding) => exports.percent(val * 100, padding);
exports.deg = (val, padding) => exports.unit('\u00B0', +(val).toFixed(2), padding);
exports.func = (name, ...keys) => `**${name}(**${keys.join(', ')}**)**`;
//# sourceMappingURL=display_helper.js.map