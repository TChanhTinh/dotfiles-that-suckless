"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const color_extractor_1 = require("./color_extractor");
const color_info_display_1 = require("./color_info_display");
const configuration_1 = require("./configuration");
const hover_provider_1 = require("./hover_provider");
/**
 * Main extension activation.
 */
function activate(context) {
    function reload() {
        for (const existing of providerRegistrations) {
            existing.dispose();
        }
        providerRegistrations = [];
        const workspaceConfig = vscode.workspace.getConfiguration('colorInfo');
        const display = new color_info_display_1.ColorDisplay(workspaceConfig);
        const languageConfig = configuration_1.LanguagesConfiguration.load(workspaceConfig);
        for (const lang of languageConfig.languages) {
            const hoverProvider = new hover_provider_1.default(new color_extractor_1.ColorExtractor(lang.colorExtractors), display);
            const registration = vscode.languages.registerHoverProvider(lang.selector, hoverProvider);
            providerRegistrations.push(registration);
        }
    }
    let providerRegistrations = [];
    context.subscriptions.push(new vscode.Disposable(() => {
        vscode.Disposable.from(...providerRegistrations).dispose();
        providerRegistrations = [];
    }));
    vscode.workspace.onDidChangeConfiguration(() => {
        reload();
    });
    reload();
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map