"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.Logger = void 0;
const vscode_1 = require("vscode");
class Logger {
    constructor(output) {
        this.output = output;
        this.output = output;
    }
    log(msg) {
        const d = new Date();
        const date = d.toISOString().split('T')[0];
        const time = d.toTimeString().split(' ')[0];
        const ms = (d.getMilliseconds() + '').padStart(3, '0');
        this.output.appendLine(`[${date} ${time}.${ms}] ${msg}`);
    }
    dispose() {
        this.output.dispose();
    }
}
exports.Logger = Logger;
function activate(context) {
    const logger = new Logger(vscode_1.window.createOutputChannel('ENV'));
    logger.log('activating extension');
    const formatEditProvider = vscode_1.languages.registerDocumentFormattingEditProvider('env', {
        provideDocumentFormattingEdits(document) {
            logger.log(`formatting ${document.fileName}`);
            let edits = [];
            for (let i = 0; i < document.lineCount; i++) {
                const ln = document.lineAt(i);
                const st = ln.range.start;
                const tx = ln.text;
                if (ln.isEmptyOrWhitespace) {
                    if (tx.length > 0) {
                        edits.push(vscode_1.TextEdit.delete(ln.range));
                    }
                    continue;
                }
                const fi = ln.firstNonWhitespaceCharacterIndex;
                const fs = new vscode_1.Position(i, fi);
                if (fi > 0) { // remove leading whitespace
                    edits.push(vscode_1.TextEdit.delete(new vscode_1.Range(st, fs)));
                }
                if (tx.charAt(fi) === '#') { // remove trailing whitespace in comments
                    edits.push(vscode_1.TextEdit.replace(new vscode_1.Range(fs, ln.range.end), '# ' + tx.substring(fi + 1).trim()));
                }
                else if (tx.substr(fi, 6) === 'export') { // remove whitespace between export keywords
                    let ex = tx.substring(fi + 7).trim();
                    let fe = ex.indexOf('=');
                    if (fe > 0) {
                        let key = ex.substring(0, fe).trim();
                        let val = ex.substring(fe + 1).trim();
                        if (val.indexOf(' ') >= 0 && (val[0] !== '"' && val[val.length - 1] !== '"')) {
                            val = `"${val}"`;
                        }
                        edits.push(vscode_1.TextEdit.replace(new vscode_1.Range(fs, ln.range.end), 'export ' + key + '=' + val));
                    }
                    else {
                        edits.push(vscode_1.TextEdit.replace(new vscode_1.Range(fs, ln.range.end), 'export ' + ex));
                    }
                }
                else { // remove leading and trailing whitespace in quoted string
                    let fe = tx.indexOf('=');
                    if (fe > 0) {
                        let key = tx.substring(0, fe).trim();
                        let val = tx.substring(fe + 1).trim();
                        if (val.indexOf(' ') >= 0
                            && (val[0] !== '"' && val[val.length - 1] !== '"')
                            && (val[0] !== '\'' && val[val.length - 1] !== '\'')) {
                            val = `"${val}"`;
                        }
                        edits.push(vscode_1.TextEdit.replace(new vscode_1.Range(fs, ln.range.end), key + '=' + val));
                    }
                }
            }
            return edits;
        }
    });
    const foldingRangeProvider = vscode_1.languages.registerFoldingRangeProvider('env', {
        provideFoldingRanges(document) {
            logger.log(`folding ${document.fileName}`);
            const folds = [];
            const start = /^# /, end = /^\s*$/; // regex to detect start and end of region
            let inRegion = false, sectionStart = 0;
            for (let i = 0; i < document.lineCount; i++) {
                if (start.test(document.lineAt(i).text) && !inRegion) {
                    inRegion = true;
                    sectionStart = i;
                }
                else if (end.test(document.lineAt(i).text) && inRegion) {
                    folds.push(new vscode_1.FoldingRange(sectionStart, i - 1, vscode_1.FoldingRangeKind.Region));
                    inRegion = false;
                }
            }
            return folds;
        }
    });
    context.subscriptions.push(logger, formatEditProvider, foldingRangeProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map