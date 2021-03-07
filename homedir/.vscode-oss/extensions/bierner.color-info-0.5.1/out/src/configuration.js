"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LanguageConfiguration {
    constructor(selector, colorExtractors) {
        this.selector = selector;
        this.colorExtractors = colorExtractors;
    }
    static fromUser(user) {
        const types = new Set();
        const userColors = Array.isArray(user.colors) ? user.colors : [user.colors];
        for (const t of userColors.map((x) => ('' + x).toLowerCase())) {
            switch (t) {
                case 'css':
                    types.add('rgb');
                    types.add('hsl');
                    types.add('hex');
                    types.add('hex+alpha');
                    types.add('css-color-names');
                    break;
                case 'rgb':
                case 'hsl':
                case 'hex':
                case 'hex+alpha':
                case 'css-color-names':
                    types.add(t);
                    break;
            }
        }
        const selector = typeof user.selector === 'string'
            ? [{ language: user.selector }]
            : user.selector;
        return new LanguageConfiguration(selector, types);
    }
}
/**
 * Configures
 */
class LanguagesConfiguration {
    static load(config) {
        const user = config.get('languages') || [];
        const lang = new LanguagesConfiguration(user.map((x) => LanguageConfiguration.fromUser(x)).filter((x) => x !== null));
        return lang;
    }
    constructor(languages) {
        this.languages = languages;
    }
}
exports.LanguagesConfiguration = LanguagesConfiguration;
//# sourceMappingURL=configuration.js.map