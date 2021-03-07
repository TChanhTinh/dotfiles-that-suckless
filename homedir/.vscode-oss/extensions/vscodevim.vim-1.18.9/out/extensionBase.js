"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.getAndUpdateModeHandler = void 0;
const vscode = require("vscode");
const path = require("path");
const compositionState_1 = require("./src/state/compositionState");
const editorIdentity_1 = require("./src/editorIdentity");
const globals_1 = require("./src/globals");
const jump_1 = require("./src/jumps/jump");
const modeHandlerMap_1 = require("./src/mode/modeHandlerMap");
const mode_1 = require("./src/mode/mode");
const notation_1 = require("./src/configuration/notation");
const logger_1 = require("./src/util/logger");
const statusBar_1 = require("./src/statusBar");
const vscodeContext_1 = require("./src/util/vscodeContext");
const commandLine_1 = require("./src/cmd_line/commandLine");
const configuration_1 = require("./src/configuration/configuration");
const globalState_1 = require("./src/state/globalState");
const taskQueue_1 = require("./src/taskQueue");
const register_1 = require("./src/register/register");
const specialKeys_1 = require("./src/util/specialKeys");
let extensionContext;
let previousActiveEditorId = undefined;
let lastClosedModeHandler = null;
async function getAndUpdateModeHandler(forceSyncAndUpdate = false) {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor === undefined || activeTextEditor.document.isClosed) {
        return undefined;
    }
    const activeEditorId = editorIdentity_1.EditorIdentity.fromEditor(activeTextEditor);
    let [curHandler, isNew] = await modeHandlerMap_1.ModeHandlerMap.getOrCreate(activeEditorId);
    if (isNew) {
        extensionContext.subscriptions.push(curHandler);
    }
    curHandler.vimState.editor = activeTextEditor;
    if (forceSyncAndUpdate ||
        !previousActiveEditorId ||
        !previousActiveEditorId.isEqual(activeEditorId)) {
        // We sync the cursors here because ModeHandler is specific to a document, not an editor, so we
        // need to update our representation of the cursors when switching between editors for the same document.
        // This will be unnecessary once #4889 is fixed.
        curHandler.syncCursors();
        await curHandler.updateView({ drawSelection: false, revealRange: false });
    }
    previousActiveEditorId = activeEditorId;
    if (curHandler.vimState.focusChanged) {
        curHandler.vimState.focusChanged = false;
        if (previousActiveEditorId) {
            const prevHandler = modeHandlerMap_1.ModeHandlerMap.get(previousActiveEditorId);
            prevHandler.vimState.focusChanged = true;
        }
    }
    return curHandler;
}
exports.getAndUpdateModeHandler = getAndUpdateModeHandler;
/**
 * Loads and validates the user's configuration
 */
async function loadConfiguration() {
    const validatorResults = await configuration_1.configuration.load();
    logger_1.Logger.configChanged();
    const logger = logger_1.Logger.get('Configuration');
    logger.debug(`${validatorResults.numErrors} errors found with vim configuration`);
    if (validatorResults.numErrors > 0) {
        for (let validatorResult of validatorResults.get()) {
            switch (validatorResult.level) {
                case 'error':
                    logger.error(validatorResult.message);
                    break;
                case 'warning':
                    logger.warn(validatorResult.message);
                    break;
            }
        }
    }
}
/**
 * The extension's entry point
 */
async function activate(context, handleLocal = true) {
    // before we do anything else, we need to load the configuration
    await loadConfiguration();
    const logger = logger_1.Logger.get('Extension Startup');
    logger.debug('Start');
    extensionContext = context;
    extensionContext.subscriptions.push(statusBar_1.StatusBar);
    // Load state
    register_1.Register.loadFromDisk(handleLocal);
    await Promise.all([commandLine_1.commandLine.load(extensionContext), globalState_1.globalState.load(extensionContext)]);
    if (vscode.window.activeTextEditor) {
        const filepathComponents = vscode.window.activeTextEditor.document.fileName.split(/\\|\//);
        register_1.Register.putByKey(filepathComponents[filepathComponents.length - 1], '%', undefined, true);
    }
    // workspace events
    registerEventListener(context, vscode.workspace.onDidChangeConfiguration, async () => {
        await loadConfiguration();
    }, false);
    registerEventListener(context, vscode.workspace.onDidChangeTextDocument, async (event) => {
        const textWasDeleted = (changeEvent) => changeEvent.contentChanges.length === 1 &&
            changeEvent.contentChanges[0].text === '' &&
            changeEvent.contentChanges[0].range.start.line !==
                changeEvent.contentChanges[0].range.end.line;
        const textWasAdded = (changeEvent) => changeEvent.contentChanges.length === 1 &&
            (changeEvent.contentChanges[0].text === '\n' ||
                changeEvent.contentChanges[0].text === '\r\n') &&
            changeEvent.contentChanges[0].range.start.line ===
                changeEvent.contentChanges[0].range.end.line;
        if (textWasDeleted(event)) {
            globalState_1.globalState.jumpTracker.handleTextDeleted(event.document, event.contentChanges[0].range);
        }
        else if (textWasAdded(event)) {
            globalState_1.globalState.jumpTracker.handleTextAdded(event.document, event.contentChanges[0].range, event.contentChanges[0].text);
        }
        // Change from VSCode editor should set document.isDirty to true but they initially don't!
        // There is a timing issue in VSCode codebase between when the isDirty flag is set and
        // when registered callbacks are fired. https://github.com/Microsoft/vscode/issues/11339
        const contentChangeHandler = (modeHandler) => {
            if (modeHandler.vimState.currentMode === mode_1.Mode.Insert) {
                if (modeHandler.vimState.historyTracker.currentContentChanges === undefined) {
                    modeHandler.vimState.historyTracker.currentContentChanges = [];
                }
                modeHandler.vimState.historyTracker.currentContentChanges = modeHandler.vimState.historyTracker.currentContentChanges.concat(event.contentChanges);
            }
        };
        if (globals_1.Globals.isTesting && globals_1.Globals.mockModeHandler) {
            contentChangeHandler(globals_1.Globals.mockModeHandler);
        }
        else {
            modeHandlerMap_1.ModeHandlerMap.getAll()
                .filter((modeHandler) => modeHandler.vimState.identity.fileName === event.document.fileName)
                .forEach((modeHandler) => {
                contentChangeHandler(modeHandler);
            });
        }
        if (handleLocal) {
            setTimeout(() => {
                if (!event.document.isDirty && !event.document.isUntitled && event.contentChanges.length) {
                    handleContentChangedFromDisk(event.document);
                }
            }, 0);
        }
    });
    registerEventListener(context, vscode.workspace.onDidCloseTextDocument, async (closedDocument) => {
        const documents = vscode.workspace.textDocuments;
        // Delete modehandler once all tabs of this document have been closed
        for (let editorIdentity of modeHandlerMap_1.ModeHandlerMap.getKeys()) {
            const modeHandler = modeHandlerMap_1.ModeHandlerMap.get(editorIdentity);
            let shouldDelete = false;
            if (modeHandler == null || modeHandler.vimState.editor === undefined) {
                shouldDelete = true;
            }
            else {
                const document = modeHandler.vimState.document;
                if (!documents.includes(document)) {
                    shouldDelete = true;
                    if (closedDocument === document) {
                        lastClosedModeHandler = modeHandler;
                    }
                }
            }
            if (shouldDelete) {
                modeHandlerMap_1.ModeHandlerMap.delete(editorIdentity);
            }
        }
    }, false);
    registerEventListener(context, vscode.workspace.onDidSaveTextDocument, async (document) => {
        if (configuration_1.configuration.vimrc.enable &&
            path.relative(document.fileName, configuration_1.configuration.vimrc.path) === '') {
            await configuration_1.configuration.load();
            vscode.window.showInformationMessage('Sourced new .vimrc');
        }
    });
    // window events
    registerEventListener(context, vscode.window.onDidChangeActiveTextEditor, async () => {
        const mhPrevious = previousActiveEditorId
            ? modeHandlerMap_1.ModeHandlerMap.get(previousActiveEditorId)
            : undefined;
        // Track the closed editor so we can use it the next time an open event occurs.
        // When vscode changes away from a temporary file, onDidChangeActiveTextEditor first twice.
        // First it fires when leaving the closed editor. Then onDidCloseTextDocument first, and we delete
        // the old ModeHandler. Then a new editor opens.
        //
        // This also applies to files that are merely closed, which allows you to jump back to that file similarly
        // once a new file is opened.
        lastClosedModeHandler = mhPrevious || lastClosedModeHandler;
        if (vscode.window.activeTextEditor === undefined) {
            register_1.Register.putByKey('', '%', undefined, true);
            return;
        }
        const filepathComponents = vscode.window.activeTextEditor.document.fileName.split(/\\|\//);
        register_1.Register.putByKey(filepathComponents[filepathComponents.length - 1], '%', undefined, true);
        taskQueue_1.taskQueue.enqueueTask(async () => {
            const mh = await getAndUpdateModeHandler(true);
            if (mh) {
                globalState_1.globalState.jumpTracker.handleFileJump(lastClosedModeHandler ? jump_1.Jump.fromStateNow(lastClosedModeHandler.vimState) : null, jump_1.Jump.fromStateNow(mh.vimState));
            }
        });
    }, true, true);
    registerEventListener(context, vscode.window.onDidChangeTextEditorSelection, async (e) => {
        if (vscode.window.activeTextEditor === undefined ||
            e.textEditor.document !== vscode.window.activeTextEditor.document) {
            // We don't care if user selection changed in a paneled window (e.g debug console/terminal)
            return;
        }
        const mh = await getAndUpdateModeHandler();
        if (mh === undefined) {
            // We don't care if there is no active editor
            return;
        }
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            const selectionsHash = e.selections.reduce((hash, s) => hash +
                `[${s.anchor.line}, ${s.anchor.character}; ${s.active.line}, ${s.active.character}]`, '');
            const idx = mh.vimState.selectionsChanged.ourSelections.indexOf(selectionsHash);
            if (idx > -1) {
                mh.vimState.selectionsChanged.ourSelections.splice(idx, 1);
                logger.debug(`Selections: Ignoring selection: ${selectionsHash}, Count left: ${mh.vimState.selectionsChanged.ourSelections.length}`);
                return;
            }
            else if (mh.vimState.selectionsChanged.ignoreIntermediateSelections) {
                logger.debug(`Selections: ignoring intermediate selection change: ${selectionsHash}`);
                return;
            }
            else if (mh.vimState.selectionsChanged.ourSelections.length > 0) {
                // Some intermediate selection must have slipped in after setting the
                // 'ignoreIntermediateSelections' to false. Which means we didn't count
                // for it yet, but since we have selections to be ignored then we probably
                // wanted this one to be ignored as well.
                logger.debug(`Selections: Ignoring slipped selection: ${selectionsHash}`);
                return;
            }
        }
        // We may receive changes from other panels when, having selections in them containing the same file
        // and changing text before the selection in current panel.
        if (e.textEditor !== mh.vimState.editor) {
            return;
        }
        if (mh.vimState.focusChanged) {
            mh.vimState.focusChanged = false;
            return;
        }
        if (mh.currentMode === mode_1.Mode.EasyMotionMode) {
            return;
        }
        taskQueue_1.taskQueue.enqueueTask(() => mh.handleSelectionChange(e), undefined, 
        /**
         * We don't want these to become backlogged! If they do, we'll update
         * the selection to an incorrect value and see a jittering cursor.
         */
        true);
    }, true, false);
    registerEventListener(context, vscode.window.onDidChangeTextEditorVisibleRanges, async (e) => {
        const mh = await getAndUpdateModeHandler();
        if (mh) {
            // Scrolling the viewport clears any status bar message, even errors.
            statusBar_1.StatusBar.clear(mh.vimState, true);
        }
    });
    const compositionState = new compositionState_1.CompositionState();
    // Override VSCode commands
    overrideCommand(context, 'type', async (args) => {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            const mh = await getAndUpdateModeHandler();
            if (mh) {
                if (compositionState.isInComposition) {
                    compositionState.composingText += args.text;
                }
                else {
                    await mh.handleKeyEvent(args.text);
                }
            }
        });
    });
    overrideCommand(context, 'replacePreviousChar', async (args) => {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            const mh = await getAndUpdateModeHandler();
            if (mh) {
                if (compositionState.isInComposition) {
                    compositionState.composingText =
                        compositionState.composingText.substr(0, compositionState.composingText.length - args.replaceCharCnt) + args.text;
                }
                else {
                    await vscode.commands.executeCommand('default:replacePreviousChar', {
                        text: args.text,
                        replaceCharCnt: args.replaceCharCnt,
                    });
                    mh.vimState.cursorStopPosition = mh.vimState.editor.selection.start;
                    mh.vimState.cursorStartPosition = mh.vimState.editor.selection.start;
                }
            }
        });
    });
    overrideCommand(context, 'compositionStart', async () => {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            compositionState.isInComposition = true;
        });
    });
    overrideCommand(context, 'compositionEnd', async () => {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            const mh = await getAndUpdateModeHandler();
            if (mh) {
                const text = compositionState.composingText;
                compositionState.reset();
                await mh.handleMultipleKeyEvents(text.split(''));
            }
        });
    });
    // Register extension commands
    registerCommand(context, 'vim.showQuickpickCmdLine', async () => {
        const mh = await getAndUpdateModeHandler();
        if (mh) {
            await commandLine_1.commandLine.PromptAndRun('', mh.vimState);
            mh.updateView();
        }
    });
    registerCommand(context, 'vim.remap', async (args) => {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            const mh = await getAndUpdateModeHandler();
            if (mh === undefined) {
                return;
            }
            if (!args) {
                throw new Error("'args' is undefined. For this remap to work it needs to have 'args' with an '\"after\": string[]' and/or a '\"commands\": { command: string; args: any[] }[]'");
            }
            if (args.after) {
                for (const key of args.after) {
                    await mh.handleKeyEvent(notation_1.Notation.NormalizeKey(key, configuration_1.configuration.leader));
                }
            }
            if (args.commands) {
                for (const command of args.commands) {
                    // Check if this is a vim command by looking for :
                    if (command.command.startsWith(':')) {
                        await commandLine_1.commandLine.Run(command.command.slice(1, command.command.length), mh.vimState);
                        mh.updateView();
                    }
                    else {
                        vscode.commands.executeCommand(command.command, command.args);
                    }
                }
            }
        });
    });
    registerCommand(context, 'toggleVim', async () => {
        configuration_1.configuration.disableExtension = !configuration_1.configuration.disableExtension;
        toggleExtension(configuration_1.configuration.disableExtension, compositionState);
    });
    registerCommand(context, 'vim.editVimrc', async () => {
        const document = await vscode.workspace.openTextDocument(configuration_1.configuration.vimrc.path);
        await vscode.window.showTextDocument(document);
    }, false);
    for (const boundKey of configuration_1.configuration.boundKeyCombinations) {
        const command = ['<Esc>', '<C-c>'].includes(boundKey.key)
            ? async () => {
                const didStopRemap = await forceStopRecursiveRemap();
                if (!didStopRemap) {
                    handleKeyEvent(`${boundKey.key}`);
                }
            }
            : () => {
                handleKeyEvent(`${boundKey.key}`);
            };
        registerCommand(context, boundKey.command, command);
    }
    {
        // Initialize mode handler for current active Text Editor at startup.
        const modeHandler = await getAndUpdateModeHandler();
        if (modeHandler) {
            if (!configuration_1.configuration.startInInsertMode) {
                const vimState = modeHandler.vimState;
                // Make sure no cursors start on the EOL character (which is invalid in normal mode)
                // This can happen if we quit last session in insert mode at the end of the line
                vimState.cursors = vimState.cursors.map((cursor) => {
                    const eolColumn = vimState.document.lineAt(cursor.stop).text.length;
                    if (cursor.stop.character >= eolColumn) {
                        const character = Math.max(eolColumn - 1, 0);
                        return cursor.withNewStop(cursor.stop.with({ character }));
                    }
                    else {
                        return cursor;
                    }
                });
            }
            // This is called last because getAndUpdateModeHandler() will change cursor
            modeHandler.updateView({ drawSelection: true, revealRange: false });
        }
    }
    // Disable automatic keyboard navigation in lists, so it doesn't interfere
    // with our list navigation keybindings
    await vscodeContext_1.VSCodeContext.set('listAutomaticKeyboardNavigation', false);
    await toggleExtension(configuration_1.configuration.disableExtension, compositionState);
    logger.debug('Finish.');
}
exports.activate = activate;
/**
 * Toggles the VSCodeVim extension between Enabled mode and Disabled mode. This
 * function is activated by calling the 'toggleVim' command from the Command Palette.
 *
 * @param isDisabled if true, sets VSCodeVim to Disabled mode; else sets to enabled mode
 */
async function toggleExtension(isDisabled, compositionState) {
    await vscodeContext_1.VSCodeContext.set('vim.active', !isDisabled);
    const mh = await getAndUpdateModeHandler();
    if (mh) {
        if (isDisabled) {
            await mh.handleKeyEvent(specialKeys_1.SpecialKeys.ExtensionDisable);
            compositionState.reset();
            modeHandlerMap_1.ModeHandlerMap.clear();
        }
        else {
            await mh.handleKeyEvent(specialKeys_1.SpecialKeys.ExtensionEnable);
        }
    }
}
function overrideCommand(context, command, callback) {
    const disposable = vscode.commands.registerCommand(command, async (args) => {
        if (configuration_1.configuration.disableExtension) {
            return vscode.commands.executeCommand('default:' + command, args);
        }
        if (!vscode.window.activeTextEditor) {
            return;
        }
        if (vscode.window.activeTextEditor.document &&
            vscode.window.activeTextEditor.document.uri.toString() === 'debug:input') {
            return vscode.commands.executeCommand('default:' + command, args);
        }
        return callback(args);
    });
    context.subscriptions.push(disposable);
}
function registerCommand(context, command, callback, requiresActiveEditor = true) {
    const disposable = vscode.commands.registerCommand(command, async (args) => {
        if (requiresActiveEditor && !vscode.window.activeTextEditor) {
            return;
        }
        callback(args);
    });
    context.subscriptions.push(disposable);
}
function registerEventListener(context, event, listener, exitOnExtensionDisable = true, exitOnTests = false) {
    const disposable = event(async (e) => {
        if (exitOnExtensionDisable && configuration_1.configuration.disableExtension) {
            return;
        }
        if (exitOnTests && globals_1.Globals.isTesting) {
            return;
        }
        listener(e);
    });
    context.subscriptions.push(disposable);
}
async function handleKeyEvent(key) {
    const mh = await getAndUpdateModeHandler();
    if (mh) {
        taskQueue_1.taskQueue.enqueueTask(async () => {
            await mh.handleKeyEvent(key);
        });
    }
}
/**
 * @returns true if there was a remap being executed to stop
 */
async function forceStopRecursiveRemap() {
    const mh = await getAndUpdateModeHandler();
    if (mh === null || mh === void 0 ? void 0 : mh.remapState.isCurrentlyPerformingRecursiveRemapping) {
        mh.remapState.forceStopRecursiveRemapping = true;
        return true;
    }
    return false;
}
function handleContentChangedFromDisk(document) {
    modeHandlerMap_1.ModeHandlerMap.getAll()
        .filter((modeHandler) => modeHandler.vimState.identity.fileName === document.fileName)
        .forEach((modeHandler) => {
        modeHandler.vimState.historyTracker.clear();
    });
}

//# sourceMappingURL=extensionBase.js.map
