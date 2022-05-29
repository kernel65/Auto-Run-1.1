/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./logic/filemanager.ts":
/*!******************************!*\
  !*** ./logic/filemanager.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readFile = exports.writeFile = exports.readFileSync = exports.writeFileSync = exports.parseSyncWord = exports.FILE_PATH = void 0;
exports.FILE_PATH = `${overwolf.io.paths.documents}\\OverwolfAutopath\\position.pos`;
function parseSyncWord(line, separator) {
    let str = '';
    try {
        const parts = line.trim().split(separator);
        str = parts[parts.length - 1].trim();
    }
    catch (e) {
        console.log('Exception!' + e);
    }
    return str;
}
exports.parseSyncWord = parseSyncWord;
function writeFileSync(file_path, data) {
    console.log('Inside writeFile');
    function callback() {
        console.log('Inside Callback');
    }
    overwolf.io.writeFileContents(file_path, data, "ASCII", true, callback);
}
exports.writeFileSync = writeFileSync;
function readFileSync(file_path) {
    let data;
    function callback(res) {
        data = res.content;
        return res;
    }
    console.log('Перед вызовом readFileContents');
    overwolf.io.readFileContents(file_path, "ASCII", res => callback(res));
    console.log('Возврат данных data = ' + data);
    return data;
}
exports.readFileSync = readFileSync;
async function writeFile(content) {
    const result = await new Promise((resolve, reject) => {
        overwolf.io.writeFileContents(exports.FILE_PATH, content, "ASCII", true, r => r.success ? resolve(r) : reject(r));
    });
    console.log('writeFile()', result);
    return result;
}
exports.writeFile = writeFile;
async function readFile() {
    const result = await new Promise(resolve => {
        overwolf.io.readFileContents(exports.FILE_PATH, "ASCII", resolve);
    });
    return result.content;
}
exports.readFile = readFile;


/***/ }),

/***/ "./logic/hooks.ts":
/*!************************!*\
  !*** ./logic/hooks.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeHooks = exports.registerEventCallback = exports.positionUpdateRate = void 0;
const dist_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts/dist */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const consts_1 = __webpack_require__(/*! ../src/consts */ "./src/consts.ts");
const unloadingEvent_1 = __webpack_require__(/*! ./unloadingEvent */ "./logic/unloadingEvent.ts");
const fileManager = __webpack_require__(/*! ./filemanager */ "./logic/filemanager.ts");
const FILE_PATH = `${overwolf.io.paths.documents}\\OverwolfAutopath11\\test11.txt`;
exports.positionUpdateRate = 40;
const onPlayerDataUpdateEvent = new unloadingEvent_1.default('onPlayerDataUpdate');
exports.registerEventCallback = onPlayerDataUpdateEvent.register;
function onUpdate(info) {
    const playerData = transformData(info);
    if (!playerData) {
        return;
    }
    onPlayerDataUpdateEvent.fire(playerData);
}
function writeData(data) {
    fileManager.readFile().then((str) => {
        const canWrite = fileManager.parseSyncWord(str, ';');
        if (canWrite == 'canwrite' || canWrite == '') {
            console.log("We can write!!");
            fileManager.writeFile(data);
        }
        else {
            console.log("We can't write file");
        }
    });
}
function transformData(info) {
    if (info.success && info.res && info.res.game_info) {
        info = info.res.game_info;
    }
    if (!info.location) {
        return undefined;
    }
    const locationParts = info.location.trim().split(',');
    const position = {
        x: parseFloat(locationParts[1]),
        y: parseFloat(locationParts[3]),
        z: parseFloat(locationParts[5]),
    };
    const rotation = -(parseFloat(locationParts[11]) - 90) * Math.PI / 180;
    writeData(position.x + ';' +
        position.y + ';' +
        position.z + ';' +
        locationParts[11] + ';' +
        'canread');
    const compass = locationParts[13].trim();
    return {
        position,
        rotation,
        compass,
        map: info.map ? info.map.trim() : undefined,
        name: info.player_name ? info.player_name.trim() : undefined,
        world: info.world_name ? info.world_name.trim() : undefined,
    };
}
function initializeHooks() {
    const listener = new dist_1.OWGamesEvents({
        onInfoUpdates: onUpdate,
        onNewEvents: onUpdate,
    }, consts_1.interestingFeatures);
    listener.start();
    setInterval(() => overwolf.games.events.getInfo(onUpdate), exports.positionUpdateRate);
    window.NWMM_registerEventCallback = onPlayerDataUpdateEvent.register;
}
exports.initializeHooks = initializeHooks;


/***/ }),

/***/ "./logic/unloadingEvent.ts":
/*!*********************************!*\
  !*** ./logic/unloadingEvent.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class UnloadingEvent {
    constructor(name) {
        this.name = name;
        this.listeners = new Set();
        this.register = (listener, listenerWindow) => {
            this.listeners.add(listener);
            const cleanup = () => {
                listenerWindow.removeEventListener('beforeunload', handleBeforeUnload);
                const deleted = this.listeners.delete(listener);
            };
            function handleBeforeUnload() {
                cleanup();
            }
            listenerWindow.addEventListener('beforeunload', cleanup);
            return cleanup;
        };
        this.fire = (...args) => {
            this.listeners.forEach(l => {
                try {
                    l(...args);
                }
                catch (err) {
                    console.error(err);
                }
            });
        };
    }
}
exports.default = UnloadingEvent;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hotkeys = exports.windowNames = exports.interestingFeatures = exports.newWorldId = void 0;
const newWorldId = 21816;
exports.newWorldId = newWorldId;
const interestingFeatures = [
    'location',
];
exports.interestingFeatures = interestingFeatures;
const windowNames = {
    inGame: 'in_game',
    desktop: 'desktop',
    background: 'background',
};
exports.windowNames = windowNames;
const hotkeys = {
    toggleInGame: 'showhide',
    zoomIn: 'zoomIn',
    zoomOut: 'zoomOut',
};
exports.hotkeys = hotkeys;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const hooks_1 = __webpack_require__(/*! ../../logic/hooks */ "./logic/hooks.ts");
hooks_1.initializeHooks();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbG9naWMvZmlsZW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL2xvZ2ljL2hvb2tzLnRzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9sb2dpYy91bmxvYWRpbmdFdmVudC50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQSxrQ0FBa0Msb0NBQW9DLGFBQWEsRUFBRSxFQUFFO0FBQ3ZGLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxhQUFhLG1CQUFPLENBQUMsNkZBQW9CO0FBQ3pDLGFBQWEsbUJBQU8sQ0FBQywyRkFBbUI7QUFDeEMsYUFBYSxtQkFBTyxDQUFDLDZFQUFZO0FBQ2pDLGFBQWEsbUJBQU8sQ0FBQyxpRkFBYztBQUNuQyxhQUFhLG1CQUFPLENBQUMsbUZBQWU7QUFDcEMsYUFBYSxtQkFBTyxDQUFDLCtFQUFhOzs7Ozs7Ozs7OztBQ2pCckI7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsc0JBQXNCO0FBQ3RCLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7Ozs7Ozs7Ozs7O0FDN0NUO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHFCQUFxQjtBQUNyQixnQkFBZ0IsbUJBQU8sQ0FBQyx1RUFBUztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0I7QUFDQSxnQ0FBZ0MsWUFBWTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7Ozs7Ozs7Ozs7QUM1RFI7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDN0JGO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELGlCQUFpQjtBQUNqQjtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsaUJBQWlCOzs7Ozs7Ozs7OztBQzVCSjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7Ozs7Ozs7Ozs7QUNYTDtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFLEdBQUcsV0FBVyxhQUFhO0FBQ3hHO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsRUFBRTtBQUMvQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLGdCQUFnQjs7Ozs7Ozs7Ozs7QUM5SEg7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7Ozs7Ozs7Ozs7Ozs7QUM5QkEsaUJBQVMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsa0NBQWtDLENBQUM7QUFHMUYsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxTQUFpQjtJQUN6RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFFYixJQUFHO1FBQ0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDeEM7SUFDRCxPQUFPLENBQUMsRUFBQztRQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO0lBRUYsT0FBTyxHQUFHLENBQUM7QUFDZCxDQUFDO0FBWkQsc0NBWUM7QUFHRCxTQUFnQixhQUFhLENBQUMsU0FBaUIsRUFBRSxJQUFZO0lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUVoQyxTQUFTLFFBQVE7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQ3pCLFNBQVMsRUFDVCxJQUFJLFdBRUosSUFBSSxFQUNKLFFBQVEsQ0FDWCxDQUFDO0FBQ04sQ0FBQztBQWRELHNDQWNDO0FBS0QsU0FBZ0IsWUFBWSxDQUFDLFNBQWlCO0lBQzFDLElBQUksSUFBSSxDQUFDO0lBRVQsU0FBUyxRQUFRLENBQUMsR0FBdUM7UUFDckQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDbkIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQ3hCLFNBQVMsV0FFVCxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FDdkI7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzdDLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFqQkQsb0NBaUJDO0FBR00sS0FBSyxVQUFVLFNBQVMsQ0FBQyxPQUFlO0lBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkQsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDM0IsaUJBQVMsRUFDVCxPQUFPLFdBRVAsSUFBSSxFQUNKLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ3hDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRW5DLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFkSCw4QkFjRztBQUdJLEtBQUssVUFBVSxRQUFRO0lBQzFCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDekMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDMUIsaUJBQVMsV0FFVCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBUSxNQUE2QyxDQUFDLE9BQU8sQ0FBQztBQUNsRSxDQUFDO0FBVkQsNEJBVUM7Ozs7Ozs7Ozs7Ozs7O0FDcEZELG1JQUErRDtBQUMvRCw2RUFBb0Q7QUFDcEQsa0dBQThDO0FBQzlDLHVGQUE2QztBQU03QyxNQUFNLFNBQVMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsa0NBQWtDLENBQUM7QUFDdEUsMEJBQWtCLEdBQUcsRUFBRSxDQUFDO0FBSXJDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSx3QkFBYyxDQUE2QixvQkFBb0IsQ0FBQyxDQUFDO0FBR3hGLDZCQUFxQixHQUFHLHVCQUF1QixDQUFDLFFBQVEsQ0FBQztBQU90RSxTQUFTLFFBQVEsQ0FBQyxJQUFTO0lBQ3ZCLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsT0FBTztLQUNWO0lBR0QsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTdDLENBQUM7QUFJRCxTQUFTLFNBQVMsQ0FBQyxJQUFZO0lBQzNCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNoQyxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyRCxJQUFHLFFBQVEsSUFBSSxVQUFVLElBQUksUUFBUSxJQUFJLEVBQUUsRUFBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFOUIsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjthQUNHO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUdELFNBQVMsYUFBYSxDQUFDLElBQVM7SUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7UUFDaEQsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0tBQzdCO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDaEIsT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCxNQUFNLGFBQWEsR0FBSSxJQUFJLENBQUMsUUFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbEUsTUFBTSxRQUFRLEdBQUc7UUFDYixDQUFDLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQyxDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUd2RSxTQUFTLENBQ0wsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHO1FBQ2hCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRztRQUNoQixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUc7UUFDaEIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUc7UUFDdkIsU0FBUyxDQUNaLENBQUM7SUFHRixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFekMsT0FBTztRQUNILFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3ZELElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsV0FBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUN4RSxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLFVBQXFCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7S0FDMUUsQ0FBQztBQUNOLENBQUM7QUFHRCxTQUFnQixlQUFlO0lBQzNCLE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQWEsQ0FBQztRQUMvQixhQUFhLEVBQUUsUUFBUTtRQUN2QixXQUFXLEVBQUUsUUFBUTtLQUN4QixFQUFFLDRCQUFtQixDQUFDLENBQUM7SUFFeEIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsMEJBQWtCLENBQUMsQ0FBQztJQUM5RSxNQUE2QixDQUFDLDBCQUEwQixHQUFHLHVCQUF1QixDQUFDLFFBQVEsQ0FBQztBQUNqRyxDQUFDO0FBVEQsMENBU0M7Ozs7Ozs7Ozs7Ozs7QUNuR0QsTUFBcUIsY0FBYztJQUcvQixZQUFvQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUZ4QixjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWEsQ0FBQztRQUlsQyxhQUFRLEdBQUcsQ0FBQyxRQUFtQixFQUFFLGNBQXNCLEVBQUUsRUFBRTtZQUM5RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUk3QixNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFJcEQsQ0FBQyxDQUFDO1lBQ0YsU0FBUyxrQkFBa0I7Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDO1lBQ2QsQ0FBQztZQUNELGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDekQsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQUVNLFNBQUksR0FBRyxDQUFDLEdBQUcsSUFBMkIsRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixJQUFJO29CQUNBLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2lCQUNkO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBRXRCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBOUJtQyxDQUFDO0NBK0J4QztBQWxDRCxpQ0FrQ0M7Ozs7Ozs7Ozs7Ozs7O0FDdkNELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQztBQXNCckIsZ0NBQVU7QUFwQmQsTUFBTSxtQkFBbUIsR0FBRztJQUN4QixVQUFVO0NBQ2IsQ0FBQztBQW1CRSxrREFBbUI7QUFqQnZCLE1BQU0sV0FBVyxHQUFHO0lBQ2hCLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFVBQVUsRUFBRSxZQUFZO0NBQ2xCLENBQUM7QUFjUCxrQ0FBVztBQVRmLE1BQU0sT0FBTyxHQUFHO0lBQ1osWUFBWSxFQUFFLFVBQVU7SUFDeEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsT0FBTyxFQUFFLFNBQVM7Q0FDWixDQUFDO0FBTVAsMEJBQU87Ozs7Ozs7VUN6Qlg7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3JCQSxpRkFBa0Q7QUFFbEQsdUJBQWUsRUFBRSxDQUFDIiwiZmlsZSI6ImpzL2JhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWUtbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXMtZXZlbnRzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWhvdGtleXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctd2luZG93XCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IHZvaWQgMDtcclxuY29uc3Qgb3dfbGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpO1xyXG5jbGFzcyBPV0dhbWVMaXN0ZW5lciBleHRlbmRzIG93X2xpc3RlbmVyXzEuT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHN1cGVyKGRlbGVnYXRlKTtcclxuICAgICAgICB0aGlzLm9uR2FtZUluZm9VcGRhdGVkID0gKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZSB8fCAhdXBkYXRlLmdhbWVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUucnVubmluZ0NoYW5nZWQgJiYgIXVwZGF0ZS5nYW1lQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGUuZ2FtZUluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25SdW5uaW5nR2FtZUluZm8gPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLmFkZExpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyh0aGlzLm9uUnVubmluZ0dhbWVJbmZvKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IE9XR2FtZUxpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSB2b2lkIDA7XHJcbmNvbnN0IHRpbWVyXzEgPSByZXF1aXJlKFwiLi90aW1lclwiKTtcclxuY2xhc3MgT1dHYW1lc0V2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgcmVxdWlyZWRGZWF0dXJlcywgZmVhdHVyZVJldHJpZXMgPSAxMCkge1xyXG4gICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uSW5mb1VwZGF0ZXMoaW5mby5pbmZvKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25OZXdFdmVudHMgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbk5ld0V2ZW50cyhlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IHJlcXVpcmVkRmVhdHVyZXM7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZVJldHJpZXMgPSBmZWF0dXJlUmV0cmllcztcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5nZXRJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0UmVxdWlyZWRGZWF0dXJlcygpIHtcclxuICAgICAgICBsZXQgdHJpZXMgPSAxLCByZXN1bHQ7XHJcbiAgICAgICAgd2hpbGUgKHRyaWVzIDw9IHRoaXMuX2ZlYXR1cmVSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLnNldFJlcXVpcmVkRmVhdHVyZXModGhpcy5fcmVxdWlyZWRGZWF0dXJlcywgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBzdWNjZXNzOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5zdXBwb3J0ZWRGZWF0dXJlcy5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCB0aW1lcl8xLlRpbWVyLndhaXQoMzAwMCk7XHJcbiAgICAgICAgICAgIHRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2Fybignc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBmYWlsdXJlIGFmdGVyICcgKyB0cmllcyArICcgdHJpZXMnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLmFkZExpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLmFkZExpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgdW5SZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVEFSVGApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldFJlcXVpcmVkRmVhdHVyZXMoKTtcclxuICAgICAgICBjb25zdCB7IHJlcywgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLmdldEluZm8oKTtcclxuICAgICAgICBpZiAocmVzICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyh7IGluZm86IHJlcyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUT1BgKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSBPV0dhbWVzRXZlbnRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XR2FtZXMge1xyXG4gICAgc3RhdGljIGdldFJ1bm5pbmdHYW1lSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsYXNzSWRGcm9tR2FtZUlkKGdhbWVJZCkge1xyXG4gICAgICAgIGxldCBjbGFzc0lkID0gTWF0aC5mbG9vcihnYW1lSWQgLyAxMCk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzSWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCA9IDMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0LCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZ2FtZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lcyA9IE9XR2FtZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0hvdGtleXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHN0YXRpYyBnZXRIb3RrZXlUZXh0KGhvdGtleUlkLCBnYW1lSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuZ2V0KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdGtleTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZUlkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nbG9iYWxzLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuZ2FtZXMgJiYgcmVzdWx0LmdhbWVzW2dhbWVJZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nYW1lc1tnYW1lSWRdLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG90a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShob3RrZXkuYmluZGluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdVTkFTU0lHTkVEJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9uSG90a2V5RG93bihob3RrZXlJZCwgYWN0aW9uKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vblByZXNzZWQuYWRkTGlzdGVuZXIoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5uYW1lID09PSBob3RrZXlJZClcclxuICAgICAgICAgICAgICAgIGFjdGlvbihyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gT1dIb3RrZXlzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNsYXNzIE9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gT1dMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV1dpbmRvdyA9IHZvaWQgMDtcclxuY2xhc3MgT1dXaW5kb3cge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZXN0b3JlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5yZXN0b3JlKGlkLCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbcmVzdG9yZV0gLSBhbiBlcnJvciBvY2N1cnJlZCwgd2luZG93SWQ9JHtpZH0sIHJlYXNvbj0ke3Jlc3VsdC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtaW5pbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWluaW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtYXhpbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWF4aW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5oaWRlKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdC53aW5kb3dfc3RhdGUgIT09ICdjbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRyYWdNb3ZlKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyBkcmFnZ2FibGUnO1xyXG4gICAgICAgIGVsZW0ub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmRyYWdNb3ZlKHRoaXMuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0V2luZG93U3RhdGUoaWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEN1cnJlbnRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3cocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LndpbmRvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb2J0YWluKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgJiYgcmVzLndpbmRvdyAmJiByZXMud2luZG93LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSByZXMud2luZG93LmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcmVzLndpbmRvdy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm9idGFpbkRlY2xhcmVkV2luZG93KHRoaXMuX25hbWUsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYXNzdXJlT2J0YWluZWQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0Lm9idGFpbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaW50ZXJuYWxDbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5jbG9zZShpZCwgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XV2luZG93ID0gT1dXaW5kb3c7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGltZXIgPSB2b2lkIDA7XHJcbmNsYXNzIFRpbWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCBpZCkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGltZXJFdmVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uVGltZXIodGhpcy5faWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHdhaXQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsSW5NUyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGFydChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRpbWVyRXZlbnQsIGludGVydmFsSW5NUyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lcklkID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXJJZCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJleHBvcnQgY29uc3QgRklMRV9QQVRIID0gYCR7b3ZlcndvbGYuaW8ucGF0aHMuZG9jdW1lbnRzfVxcXFxPdmVyd29sZkF1dG9wYXRoXFxcXHBvc2l0aW9uLnBvc2A7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3luY1dvcmQobGluZTogc3RyaW5nLCBzZXBhcmF0b3I6IHN0cmluZyk6IHN0cmluZ3tcclxuICAgIGxldCBzdHIgPSAnJztcclxuICAgXHJcbiAgICB0cnl7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSBsaW5lLnRyaW0oKS5zcGxpdChzZXBhcmF0b3IpO1xyXG4gICAgICAgIHN0ciA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnRXhjZXB0aW9uIScgKyBlKTtcclxuICAgIH1cclxuXHJcbiAgIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVGaWxlU3luYyhmaWxlX3BhdGg6IHN0cmluZywgZGF0YTogc3RyaW5nKXtcclxuICAgIGNvbnNvbGUubG9nKCdJbnNpZGUgd3JpdGVGaWxlJyk7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0luc2lkZSBDYWxsYmFjaycpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvdmVyd29sZi5pby53cml0ZUZpbGVDb250ZW50cyhcclxuICAgICAgICBmaWxlX3BhdGgsIFxyXG4gICAgICAgIGRhdGEsIFxyXG4gICAgICAgIG92ZXJ3b2xmLmlvLmVudW1zLmVFbmNvZGluZy5BU0NJSSxcclxuICAgICAgICB0cnVlLFxyXG4gICAgICAgIGNhbGxiYWNrICAgIFxyXG4gICAgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRGaWxlU3luYyhmaWxlX3BhdGg6IHN0cmluZyk6IHN0cmluZ3sgICAgXHJcbiAgICBsZXQgZGF0YTtcclxuICAgXHJcbiAgICBmdW5jdGlvbiBjYWxsYmFjayhyZXM6IG92ZXJ3b2xmLmlvLlJlYWRGaWxlQ29udGVudHNSZXN1bHQpe1xyXG4gICAgICAgIGRhdGEgPSByZXMuY29udGVudDtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZygn0J/QtdGA0LXQtCDQstGL0LfQvtCy0L7QvCByZWFkRmlsZUNvbnRlbnRzJyk7XHJcbiAgICBvdmVyd29sZi5pby5yZWFkRmlsZUNvbnRlbnRzKFxyXG4gICAgICAgIGZpbGVfcGF0aCxcclxuICAgICAgICBvdmVyd29sZi5pby5lbnVtcy5lRW5jb2RpbmcuQVNDSUksXHJcbiAgICAgICAgcmVzID0+IGNhbGxiYWNrKHJlcylcclxuICAgIClcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ9CS0L7Qt9Cy0YDQsNGCINC00LDQvdC90YvRhSBkYXRhID0gJyArIGRhdGEpO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVGaWxlKGNvbnRlbnQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBvdmVyd29sZi5pby53cml0ZUZpbGVDb250ZW50cyhcclxuICAgICAgICBGSUxFX1BBVEgsXHJcbiAgICAgICAgY29udGVudCxcclxuICAgICAgICBvdmVyd29sZi5pby5lbnVtcy5lRW5jb2RpbmcuQVNDSUksXHJcbiAgICAgICAgdHJ1ZSxcclxuICAgICAgICByID0+IHIuc3VjY2VzcyA/IHJlc29sdmUocikgOiByZWplY3QocilcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc29sZS5sb2coJ3dyaXRlRmlsZSgpJywgcmVzdWx0KTtcclxuICBcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkRmlsZSgpIHsgICBcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBvdmVyd29sZi5pby5yZWFkRmlsZUNvbnRlbnRzKFxyXG4gICAgICAgIEZJTEVfUEFUSCxcclxuICAgICAgICBvdmVyd29sZi5pby5lbnVtcy5lRW5jb2RpbmcuQVNDSUksXHJcbiAgICAgICAgcmVzb2x2ZVxyXG4gICAgICApO1xyXG4gICAgfSk7IFxyXG4gICAgXHJcbiAgICByZXR1cm4gKHJlc3VsdCBhcyBvdmVyd29sZi5pby5SZWFkRmlsZUNvbnRlbnRzUmVzdWx0KS5jb250ZW50O1xyXG59XHJcbiIsImltcG9ydCB7IE9XR2FtZXNFdmVudHMgfSBmcm9tICdAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QnO1xuaW1wb3J0IHsgaW50ZXJlc3RpbmdGZWF0dXJlcyB9IGZyb20gJy4uL3NyYy9jb25zdHMnO1xuaW1wb3J0IFVubG9hZGluZ0V2ZW50IGZyb20gJy4vdW5sb2FkaW5nRXZlbnQnO1xuaW1wb3J0ICogYXMgZmlsZU1hbmFnZXIgZnJvbSAnLi9maWxlbWFuYWdlcic7XG5cbnR5cGUgT3ZlcndvbGZIb29rV2luZG93ID0gdHlwZW9mIHdpbmRvdyAmIHtcbiAgICBOV01NX3JlZ2lzdGVyRXZlbnRDYWxsYmFjazogdHlwZW9mIG9uUGxheWVyRGF0YVVwZGF0ZUV2ZW50LnJlZ2lzdGVyO1xufVxuXG5jb25zdCBGSUxFX1BBVEggPSBgJHtvdmVyd29sZi5pby5wYXRocy5kb2N1bWVudHN9XFxcXE92ZXJ3b2xmQXV0b3BhdGgxMVxcXFx0ZXN0MTEudHh0YDtcbmV4cG9ydCBjb25zdCBwb3NpdGlvblVwZGF0ZVJhdGUgPSA0MDtcblxudHlwZSBPblBsYXllckRhdGFVcGRhdGVMaXN0ZW5lciA9IChpbmZvOiBQbGF5ZXJEYXRhKSA9PiB2b2lkO1xuXG5jb25zdCBvblBsYXllckRhdGFVcGRhdGVFdmVudCA9IG5ldyBVbmxvYWRpbmdFdmVudDxPblBsYXllckRhdGFVcGRhdGVMaXN0ZW5lcj4oJ29uUGxheWVyRGF0YVVwZGF0ZScpO1xuXG5cbmV4cG9ydCBjb25zdCByZWdpc3RlckV2ZW50Q2FsbGJhY2sgPSBvblBsYXllckRhdGFVcGRhdGVFdmVudC5yZWdpc3RlcjtcbiAgICAvLz8gb25QbGF5ZXJEYXRhVXBkYXRlRXZlbnQucmVnaXN0ZXJcbiAgICAvLzogKG92ZXJ3b2xmLndpbmRvd3MuZ2V0TWFpbldpbmRvdygpIGFzIE92ZXJ3b2xmSG9va1dpbmRvdykuTldNTV9yZWdpc3RlckV2ZW50Q2FsbGJhY2s7XG4gXG4gXG5cbi8vRG8gc29tZXRoaW5nIHdpdGggZ2FtZSBkYXRhICAgIFxuZnVuY3Rpb24gb25VcGRhdGUoaW5mbzogYW55KSB7XG4gICAgY29uc3QgcGxheWVyRGF0YSA9IHRyYW5zZm9ybURhdGEoaW5mbyk7XG4gICAgXG4gICAgaWYgKCFwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG5cbiAgICBvblBsYXllckRhdGFVcGRhdGVFdmVudC5maXJlKHBsYXllckRhdGEpO1xuICAgIFxufVxuXG5cblxuZnVuY3Rpb24gd3JpdGVEYXRhKGRhdGE6IHN0cmluZykge1xuICAgIGZpbGVNYW5hZ2VyLnJlYWRGaWxlKCkudGhlbigoc3RyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbldyaXRlID0gZmlsZU1hbmFnZXIucGFyc2VTeW5jV29yZChzdHIsICc7Jyk7XG4gICAgICAgIGlmKGNhbldyaXRlID09ICdjYW53cml0ZScgfHwgY2FuV3JpdGUgPT0gJycpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJXZSBjYW4gd3JpdGUhIVwiKTtcbiAgICAgICAgICAgIC8v0JfQsNC/0LjRgdCw0YLRjCDQtNCw0L3QvdGL0LUg0LIg0YTQsNC50LshXG4gICAgICAgICAgICBmaWxlTWFuYWdlci53cml0ZUZpbGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2UgY2FuJ3Qgd3JpdGUgZmlsZVwiKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cblxuZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShpbmZvOiBhbnkpOiBQbGF5ZXJEYXRhIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoaW5mby5zdWNjZXNzICYmIGluZm8ucmVzICYmIGluZm8ucmVzLmdhbWVfaW5mbykge1xuICAgICAgICBpbmZvID0gaW5mby5yZXMuZ2FtZV9pbmZvO1xuICAgIH1cblxuICAgIGlmICghaW5mby5sb2NhdGlvbikge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2F0aW9uUGFydHMgPSAoaW5mby5sb2NhdGlvbiBhcyBzdHJpbmcpLnRyaW0oKS5zcGxpdCgnLCcpO1xuXG4gICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgIHg6IHBhcnNlRmxvYXQobG9jYXRpb25QYXJ0c1sxXSksXG4gICAgICAgIHk6IHBhcnNlRmxvYXQobG9jYXRpb25QYXJ0c1szXSksXG4gICAgICAgIHo6IHBhcnNlRmxvYXQobG9jYXRpb25QYXJ0c1s1XSksXG4gICAgfTtcblxuICAgIGNvbnN0IHJvdGF0aW9uID0gLShwYXJzZUZsb2F0KGxvY2F0aW9uUGFydHNbMTFdKSAtIDkwKSAqIE1hdGguUEkgLyAxODA7XG5cblxuICAgIHdyaXRlRGF0YShcbiAgICAgICAgcG9zaXRpb24ueCArICc7JyArXG4gICAgICAgIHBvc2l0aW9uLnkgKyAnOycgK1xuICAgICAgICBwb3NpdGlvbi56ICsgJzsnICtcbiAgICAgICAgbG9jYXRpb25QYXJ0c1sxMV0gKyAnOycgK1xuICAgICAgICAnY2FucmVhZCdcbiAgICApO1xuICBcblxuICAgIGNvbnN0IGNvbXBhc3MgPSBsb2NhdGlvblBhcnRzWzEzXS50cmltKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgcm90YXRpb24sXG4gICAgICAgIGNvbXBhc3MsXG4gICAgICAgIG1hcDogaW5mby5tYXAgPyAoaW5mby5tYXAgYXMgc3RyaW5nKS50cmltKCkgOiB1bmRlZmluZWQsXG4gICAgICAgIG5hbWU6IGluZm8ucGxheWVyX25hbWUgPyAoaW5mby5wbGF5ZXJfbmFtZSBhcyBzdHJpbmcpLnRyaW0oKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgd29ybGQ6IGluZm8ud29ybGRfbmFtZSA/IChpbmZvLndvcmxkX25hbWUgYXMgc3RyaW5nKS50cmltKCkgOiB1bmRlZmluZWQsXG4gICAgfTtcbn1cblxuLy9SZWdpc3RlciBldmVudHNcbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplSG9va3MoKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBuZXcgT1dHYW1lc0V2ZW50cyh7XG4gICAgICAgIG9uSW5mb1VwZGF0ZXM6IG9uVXBkYXRlLFxuICAgICAgICBvbk5ld0V2ZW50czogb25VcGRhdGUsXG4gICAgfSwgaW50ZXJlc3RpbmdGZWF0dXJlcyk7XG4gICAgXG4gICAgbGlzdGVuZXIuc3RhcnQoKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiBvdmVyd29sZi5nYW1lcy5ldmVudHMuZ2V0SW5mbyhvblVwZGF0ZSksIHBvc2l0aW9uVXBkYXRlUmF0ZSk7XG4gICAgKHdpbmRvdyBhcyBPdmVyd29sZkhvb2tXaW5kb3cpLk5XTU1fcmVnaXN0ZXJFdmVudENhbGxiYWNrID0gb25QbGF5ZXJEYXRhVXBkYXRlRXZlbnQucmVnaXN0ZXI7XG59XG4iLCIvKipcbiAqIEFuIGV2ZW50IHJlZ2lzdHJhdGlvbiBtZWNoYW5pc20sIHdoaWNoIHJlcXVpcmVzIGEgV2luZG93IG9iamVjdCB0byBiZSBwYXNzZWRcbiAqIHdpdGggZWFjaCByZWdpc3RyYXRpb24uIE9uY2UgdGhlIHdpbmRvdyBjbG9zZXMsIHRoZSBldmVudCBzdWJzY3JpcHRpb24gaXNcbiAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0ZW5lciBzZXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVubG9hZGluZ0V2ZW50PFRMaXN0ZW5lciBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PiB7XG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnMgPSBuZXcgU2V0PFRMaXN0ZW5lcj4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmFtZTogc3RyaW5nKSB7IH1cblxuICAgIHB1YmxpYyByZWdpc3RlciA9IChsaXN0ZW5lcjogVExpc3RlbmVyLCBsaXN0ZW5lcldpbmRvdzogV2luZG93KSA9PiB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgICAgIC8qaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBXaW5kb3cgJHtsaXN0ZW5lcldpbmRvdy5kb2N1bWVudD8udGl0bGUgPz8gJyh1bmtub3duKSd9IHJlZ2lzdGVyZWQgZm9yIGV2ZW50ICR7dGhpcy5uYW1lfS5gKTtcbiAgICAgICAgfSAqL1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgbGlzdGVuZXJXaW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgaGFuZGxlQmVmb3JlVW5sb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQgPSB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgICAgICAgLyppZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBXaW5kb3cgJHtsaXN0ZW5lcldpbmRvdy5kb2N1bWVudD8udGl0bGUgPz8gJyh1bmtub3duKSd9IHVucmVnaXN0ZXJlZCBmb3IgZXZlbnQgJHt0aGlzLm5hbWV9ICgke2RlbGV0ZWQgPyAnZmlyc3QnIDogJ2FnYWluJ30pLmApO1xuICAgICAgICAgICAgfSAqL1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVCZWZvcmVVbmxvYWQoKSB7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgY2xlYW51cCk7XG4gICAgICAgIHJldHVybiBjbGVhbnVwO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaXJlID0gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VExpc3RlbmVyPikgPT4ge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIC8vIGJ1dCBjb250aW51ZSBhbnl3YXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiY29uc3QgbmV3V29ybGRJZCA9IDIxODE2O1xuXG5jb25zdCBpbnRlcmVzdGluZ0ZlYXR1cmVzID0gW1xuICAgICdsb2NhdGlvbicsXG5dO1xuXG5jb25zdCB3aW5kb3dOYW1lcyA9IHtcbiAgICBpbkdhbWU6ICdpbl9nYW1lJyxcbiAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgYmFja2dyb3VuZDogJ2JhY2tncm91bmQnLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgQmFja2dyb3VuZFdpbmRvdyA9ICdiYWNrZ3JvdW5kJztcbmV4cG9ydCB0eXBlIENvbmNyZXRlV2luZG93ID0gRXhjbHVkZTxrZXlvZiB0eXBlb2Ygd2luZG93TmFtZXMsIEJhY2tncm91bmRXaW5kb3c+O1xuXG5jb25zdCBob3RrZXlzID0ge1xuICAgIHRvZ2dsZUluR2FtZTogJ3Nob3doaWRlJyxcbiAgICB6b29tSW46ICd6b29tSW4nLFxuICAgIHpvb21PdXQ6ICd6b29tT3V0Jyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB7XG4gICAgbmV3V29ybGRJZCxcbiAgICBpbnRlcmVzdGluZ0ZlYXR1cmVzLFxuICAgIHdpbmRvd05hbWVzLFxuICAgIGhvdGtleXMsXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge2luaXRpYWxpemVIb29rc30gZnJvbSAnLi4vLi4vbG9naWMvaG9va3MnO1xuXG5pbml0aWFsaXplSG9va3MoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=