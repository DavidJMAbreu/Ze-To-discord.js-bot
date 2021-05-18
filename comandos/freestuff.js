"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.FreeStuffApi = exports.GameFlag = exports.PartnerEndpoint = exports.Endpoint = void 0;
var axios_1 = require("axios");
var os_1 = require("os");
var Endpoint;
(function (Endpoint) {
    Endpoint["PING"] = "GET /ping";
    Endpoint["GAME_LIST"] = "GET /games/%s";
    Endpoint["GAME_DETAILS"] = "GET /game/%s/%s";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
var PartnerEndpoint;
(function (PartnerEndpoint) {
    PartnerEndpoint["STATUS"] = "POST /status";
    PartnerEndpoint["GAME_ANALYTICS"] = "POST /game/%s/analytics";
})(PartnerEndpoint = exports.PartnerEndpoint || (exports.PartnerEndpoint = {}));
var GameFlag;
(function (GameFlag) {
    GameFlag[GameFlag["TRASH"] = 1] = "TRASH";
    GameFlag[GameFlag["THIRDPARTY"] = 2] = "THIRDPARTY";
})(GameFlag = exports.GameFlag || (exports.GameFlag = {}));
//#endregion
var FreeStuffApi = /** @class */ (function () {
    //#region constructor
    function FreeStuffApi(settings) {
        this.settings = settings;
        //#endregion
        //#region GET game list
        this.gameList_cacheData = {};
        this.gameList_cacheUpdate = {};
        this.gameList_ratesRemaining = 5;
        this.gameList_ratesReset = 0;
        //#endregion
        //#region GET game details
        this.gameDetails_cacheData = {};
        this.gameDetails_cacheUpdate = {};
        this.gameDetails_ratesRemaining = 5;
        this.gameDetails_ratesReset = 0;
        //#endregion
        //#region event system
        this.listener = new Map();
        if (!this.settings.type)
            this.settings.type = 'basic';
        if (!this.settings.baseUrl)
            this.settings.baseUrl = 'https://management.freestuffbot.xyz/api/v1';
        if (!this.settings.cacheTtl) {
            this.settings.cacheTtl = {
                gameDetails: 1000 * 60 * 60 * 24,
                gameList: 1000 * 60 * 5
            };
        }
        if (!this.settings.cacheTtl.gameDetails)
            this.settings.cacheTtl.gameDetails = 1000 * 60 * 60 * 24;
        if (!this.settings.cacheTtl.gameList)
            this.settings.cacheTtl.gameList = 1000 * 60 * 5;
    }
    //#endregion
    //#region http core
    FreeStuffApi.prototype.getHeaders = function () {
        return {
            'Authorization': this.settings.type == 'basic'
                ? "Basic " + this.settings.key
                : "Partner " + this.settings.key + " " + this.settings.sid
        };
    };
    FreeStuffApi.prototype.makeRequest = function (endpoint, body, query) {
        var _a, _b;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var url, method, _c, args_1, arg, append, key, conf, raw, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.settings.baseUrl;
                        method = 'GET';
                        if (endpoint.includes(' ')) {
                            method = endpoint.split(' ')[0];
                            url += endpoint.substr(method.length + 1);
                        }
                        else {
                            url += endpoint;
                        }
                        for (_c = 0, args_1 = args; _c < args_1.length; _c++) {
                            arg = args_1[_c];
                            url = url.replace('%s', arg);
                        }
                        if (query && Object.keys(query).length) {
                            append = [];
                            for (key in query)
                                append.push(key + "=" + query[key]);
                            url += "?" + append.join('=');
                        }
                        if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase()))
                            throw new Error("FreeStuffApi Error. " + method + " is not a valid http request method.");
                        conf = [{ headers: this.getHeaders() }];
                        if (['POST', 'PUT'].includes(method.toUpperCase()))
                            conf = __spreadArray([body || null], conf);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"][method.toLowerCase()].apply(axios_1["default"], __spreadArray([url], conf))];
                    case 2:
                        raw = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _d.sent();
                        raw = err_1.response;
                        if ((raw === null || raw === void 0 ? void 0 : raw.status) == 403)
                            throw new Error('FreeStuffApi Error. Invalid authorization key.');
                        return [3 /*break*/, 4];
                    case 4:
                        if ((raw === null || raw === void 0 ? void 0 : raw.status) == 200)
                            return [2 /*return*/, __assign(__assign({}, raw.data), { _headers: raw.headers, _status: raw.status })];
                        if (raw === null || raw === void 0 ? void 0 : raw.data.error)
                            return [2 /*return*/, __assign(__assign({}, raw.data), { _headers: raw.headers, _status: raw.status })];
                        return [2 /*return*/, { success: false, error: (raw === null || raw === void 0 ? void 0 : raw.statusText) || 'error', message: "ApiWrapper Request failed. [http " + ((raw === null || raw === void 0 ? void 0 : raw.status) || '?') + "]", _headers: (_a = raw === null || raw === void 0 ? void 0 : raw.headers) !== null && _a !== void 0 ? _a : {}, _status: (_b = raw === null || raw === void 0 ? void 0 : raw.status) !== null && _b !== void 0 ? _b : 0 }];
                }
            });
        });
    };
    FreeStuffApi.prototype.rateLimitMeta = function (headers) {
        var _a;
        return {
            remaining: (_a = parseInt(headers['X-RateLimit-Remaining'], 10)) !== null && _a !== void 0 ? _a : -1,
            reset: Date.now() + (parseInt(headers['X-RateLimit-Reset'], 10) * 1000 - parseInt(headers['X-Server-Time'], 10))
        };
    };
    //#endregion
    //#region PING
    FreeStuffApi.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest(Endpoint.PING)];
            });
        });
    };
    FreeStuffApi.prototype.getGameList = function (category, useCache) {
        var _a;
        if (useCache === void 0) { useCache = true; }
        return __awaiter(this, void 0, void 0, function () {
            var data, rlm;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.gameList_ratesRemaining == 0 && (Date.now() - this.gameList_ratesReset < 0)) {
                            return [2 /*return*/, new Promise(function (res) { return setTimeout(function () { return res(_this.getGameList(category)); }, _this.gameList_ratesReset - Date.now()); })];
                        }
                        if (useCache) {
                            if (this.gameList_cacheData[category] && (Date.now() - this.gameList_cacheUpdate[category] < this.settings.cacheTtl.gameList))
                                return [2 /*return*/, this.gameList_cacheData[category]];
                        }
                        return [4 /*yield*/, this.makeRequest(Endpoint.GAME_LIST, null, {}, category)];
                    case 1:
                        data = _b.sent();
                        rlm = this.rateLimitMeta(data._headers);
                        this.gameList_ratesRemaining = rlm.remaining;
                        this.gameList_ratesReset = rlm.reset;
                        this.gameList_cacheData[category] = data.data || this.gameList_cacheData[category];
                        this.gameList_cacheUpdate[category] = Date.now();
                        return [2 /*return*/, (_a = data.data) !== null && _a !== void 0 ? _a : []];
                }
            });
        });
    };
    FreeStuffApi.prototype.getGameDetails = function (games, lookup, settings, useCache) {
        var _a;
        if (settings === void 0) { settings = {}; }
        if (useCache === void 0) { useCache = true; }
        return __awaiter(this, void 0, void 0, function () {
            var out, query, _i, games_1, game, cid, requestStack, _b, games_2, game, raw, _c, raw_1, res, _d, _e, id, object, cid, rlm;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        out = {};
                        query = {};
                        if (settings.language) {
                            query.lang = settings.language.join('+');
                        }
                        if (!games.length)
                            return [2 /*return*/, out];
                        if (lookup != 'info' && this.settings.type != 'partner')
                            throw new Error("FreeStuffApi Error. Tried to request partner only information. Get game details, lookup: " + lookup + ". Allowed lookups: [ 'info' ]");
                        if (useCache) {
                            for (_i = 0, games_1 = games; _i < games_1.length; _i++) {
                                game = games_1[_i];
                                cid = game + "/" + lookup;
                                if (this.gameDetails_cacheData[cid] && (Date.now() - this.gameDetails_cacheUpdate[cid] < this.settings.cacheTtl.gameDetails)) {
                                    out[game + ''] = this.gameDetails_cacheData[cid];
                                    games.splice(games.indexOf(game), 1);
                                }
                            }
                        }
                        if (!games.length)
                            return [2 /*return*/, out];
                        if (this.gameDetails_ratesRemaining == 0 && (Date.now() - this.gameDetails_ratesReset < 0)) {
                            return [2 /*return*/, new Promise(function (res) { return setTimeout(function () { return res(_this.getGameDetails(games, lookup, settings, useCache)); }, _this.gameDetails_ratesReset - Date.now()); })];
                        }
                        requestStack = [[]];
                        for (_b = 0, games_2 = games; _b < games_2.length; _b++) {
                            game = games_2[_b];
                            if (requestStack[requestStack.length - 1].length < 5)
                                requestStack[requestStack.length - 1].push(game);
                            else
                                requestStack.push([game]);
                        }
                        return [4 /*yield*/, Promise.all(requestStack.map(function (q) { return _this.makeRequest(Endpoint.GAME_DETAILS, null, query, q.join('+'), lookup); }))];
                    case 1:
                        raw = (_f.sent());
                        for (_c = 0, raw_1 = raw; _c < raw_1.length; _c++) {
                            res = raw_1[_c];
                            for (_d = 0, _e = Object.keys(res.data || {}); _d < _e.length; _d++) {
                                id = _e[_d];
                                object = (_a = (res.data && res.data[id])) !== null && _a !== void 0 ? _a : null;
                                if (object) {
                                    object.until = object.until ? new Date(object.until * 1000) : null;
                                    object.id = parseInt(id, 10);
                                }
                                out[id] = object;
                                cid = id + "/" + lookup;
                                this.gameDetails_cacheData[cid] = object;
                                this.gameDetails_cacheUpdate[cid] = Date.now();
                            }
                        }
                        rlm = this.rateLimitMeta(raw[raw.length - 1]._headers);
                        this.gameDetails_ratesRemaining = rlm.remaining;
                        this.gameDetails_ratesReset = rlm.reset;
                        return [2 /*return*/, out];
                }
            });
        });
    };
    //#endregion
    //#region POST status
    /** @access PARTNER ONLY */
    FreeStuffApi.prototype.postStatus = function (service, status, data, version, servername, suid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, res;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.settings.type != 'partner')
                            throw new Error('FreeStuffApi Error. Tried using partner-only endpoint "postStatus" as non-partner.');
                        data = data || {};
                        _a = servername;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, os_1.hostname()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        servername = _a;
                        suid = suid || this.settings.sid;
                        version = version || this.settings.version || 'unknown';
                        body = {
                            data: data, suid: suid, status: status, service: service, version: version,
                            server: servername
                        };
                        return [4 /*yield*/, this.makeRequest(PartnerEndpoint.STATUS, body)];
                    case 3:
                        res = _b.sent();
                        if ((res === null || res === void 0 ? void 0 : res.data) && (res === null || res === void 0 ? void 0 : res.data['events']))
                            res.data['events'].forEach(function (e) { return _this.emitRawEvent(e); });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    FreeStuffApi.prototype.postGameAnalytics = function (game, service, data) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                if (this.settings.type != 'partner')
                    throw new Error('FreeStuffApi Error. Tried using partner-only endpoint "postGameAnalytics" as non-partner.');
                body = {
                    service: service,
                    suid: this.settings.sid,
                    data: data
                };
                return [2 /*return*/, this.makeRequest(PartnerEndpoint.GAME_ANALYTICS, body, {}, game + '')];
            });
        });
    };
    FreeStuffApi.prototype.on = function (event, handler) {
        if (this.listener.has(event))
            this.listener.get(event).push(handler);
        else
            this.listener.set(event, [handler]);
    };
    FreeStuffApi.prototype.unregisterEventHandler = function (event) {
        if (event)
            this.listener["delete"](event);
        else
            this.listener = new Map();
    };
    FreeStuffApi.prototype.emitEvent = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (this.listener.has(event))
            this.listener.get(event).forEach(function (handler) { return handler.apply(void 0, data); });
    };
    FreeStuffApi.prototype.emitRawEvent = function (event, orElse) {
        switch (event.event) {
            case 'free_games':
                this.emitEvent('free_games', event.data);
                break;
            case 'operation':
                this.emitEvent('operation', event.data.command, event.data.arguments);
                break;
            default: orElse && orElse(event);
        }
    };
    FreeStuffApi.prototype.webhook = function () {
        var api = this;
        return function (req, res) {
            var _a;
            if (api.settings.websocketSecret) {
                if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.secret) || req.body.secret !== api.settings.websocketSecret)
                    return res.status(400).end();
            }
            api.emitRawEvent(req.body);
            res.status(200).end();
        };
    };
    return FreeStuffApi;
}());
exports.FreeStuffApi = FreeStuffApi;
