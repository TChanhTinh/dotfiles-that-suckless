"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const os = require("os");
const Color = require("color");
const template_1 = require("./template");
const walColorsPath = path.join(os.homedir(), '/.cache/wal/colors');
let autoUpdateWatcher = null;
function activate(context) {
    // Register the update command
    let disposable = vscode.commands.registerCommand('walTheme.update', generateColorThemes);
    context.subscriptions.push(disposable);
    // Start the auto update if enabled
    if (vscode.workspace.getConfiguration().get('walTheme.autoUpdate')) {
        /*
         * Update theme at startup
         * Needed for when wal palette updates while vscode isn't running.
         * The timeout is required to overcome a limitation of vscode which
         * breaks the theme autoupdate if updated too early at startup.
         */
        setTimeout(generateColorThemes, 10000);
        autoUpdateWatcher = autoUpdate();
    }
    // Toggle the auto update in real time when changing the extension configuration
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('walTheme.autoUpdate')) {
            if (vscode.workspace.getConfiguration().get('walTheme.autoUpdate')) {
                if (autoUpdateWatcher === null) {
                    autoUpdateWatcher = autoUpdate();
                }
            }
            else if (autoUpdateWatcher !== null) {
                autoUpdateWatcher.close();
                autoUpdateWatcher = null;
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
    // Close the watcher if active
    if (autoUpdateWatcher !== null) {
        autoUpdateWatcher.close();
    }
}
exports.deactivate = deactivate;
/**
 * Generates the theme from the current color palette and overwrites the last one
 */
function generateColorThemes() {
    // Import colors from pywal cache
    let colors;
    try {
        colors = fs.readFileSync(walColorsPath)
            .toString()
            .split(/\s+/, 16)
            .map(hex => Color(hex));
    }
    catch (error) {
        vscode.window.showErrorMessage('Couldn\'t load colors from pywal cache, be sure to run pywal before updating.');
        return;
    }
    // Generate the normal theme
    const colorTheme = template_1.default(colors, false);
    fs.writeFileSync(path.join(__dirname, '../themes/wal.json'), JSON.stringify(colorTheme, null, 4));
    // Generate the bordered theme
    const colorThemeBordered = template_1.default(colors, true);
    fs.writeFileSync(path.join(__dirname, '../themes/wal-bordered.json'), JSON.stringify(colorThemeBordered, null, 4));
}
/**
 * Automatically updates the theme when the color palette changes
 * @returns The watcher for the color palette
 */
function autoUpdate() {
    let fsWait = false;
    // Watch for changes in the color palette of wal
    return fs.watch(walColorsPath, (event, filename) => {
        if (filename) {
            // Delay after a change is found
            if (fsWait) {
                return;
            }
            fsWait = true;
            setTimeout(() => {
                fsWait = false;
            }, 100);
            // Update the theme
            generateColorThemes();
        }
    });
}
//# sourceMappingURL=extension.js.map