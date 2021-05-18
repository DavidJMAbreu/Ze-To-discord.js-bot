"use strict";
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
exports.__esModule = true;
exports.Banco = void 0;
var mysql = require("mysql");
var routes = require("./routes.js");
/*
    Cada conta é única de cada um dos utilizadores do servidor do discord
    Permitir enviar dinheiro de uma conta para a outra
    Permitir pedir dinheiro a alguém (A pessoa tem de aceitar usando a transacao id)

    Comandos (prefix !b)
     - consultar : consultar a conta
     - enviar <username> <montante> : Transferir para outro utilizador
     - confirmar <transactionid> : Confirmar a transação
     - movimentos <receber|enviar> : Ver as transações
     - cancelar <transactionid|todas> : Cancelar a transação
     - cafézito - dá dinheiro a cada 15 minutos com um máximo de 2 dias (25-50 random)
     - trabalhar - dá dinheiro a partir de 8h (random(900-1200))
*/
//Embed message
var reply = {
    color: "cf0000",
    author: {
        name: "Caixa Geral dos Desgraçados",
        icon_url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Logo_CGD_Wikipedia.png"
    },
    fields: [],
    description: ""
};
var Banco = /** @class */ (function () {
    function Banco() {
        console.log("Banco Aberto");
    }
    Banco.prototype.execute = function (bot, message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var comando, id, amount, money;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comando = args[0];
                        id = args[1];
                        amount = args[2];
                        if (!(comando === "consultar" ||
                            comando === "confirmar" ||
                            comando === "enviar" ||
                            comando === "cancelar" ||
                            comando === "movimentos" ||
                            comando === "cafezito" ||
                            comando === "trabalhar")) {
                            reply.description = "Aprende os comandos com **!comandos <banco>**";
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (!(comando === "consultar")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkBalance(message, message.author.username, message.author.id)];
                    case 1:
                        money = _a.sent();
                        reply.fields = [
                            {
                                name: "Conta",
                                value: "" + message.author.username,
                                inline: true
                            },
                            {
                                name: "Saldo",
                                value: money + " \u20AC",
                                inline: true
                            },
                        ];
                        reply.color = "#c6ffc1";
                        return [2 /*return*/, message.channel.send({ embed: reply })];
                    case 2:
                        if (!(comando === "enviar")) return [3 /*break*/, 4];
                        if (!id || !amount) {
                            reply.description = "Aprende os comandos com **!comandos <enviar>**";
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [4 /*yield*/, this.transfer(bot, message, id, amount)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        if (!(comando === "confirmar")) return [3 /*break*/, 6];
                        if (!id) {
                            reply.description = "Aprende os comandos com **!comandos <confirmar>**";
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [4 /*yield*/, this.confirmTransfer(message, message.author.id, id)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                    case 6:
                        if (!(comando === "cancelar")) return [3 /*break*/, 8];
                        if (!id) {
                            reply.description = "Aprende os comandos com **!comandos <cancelar>**";
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [4 /*yield*/, this.cancelTransfer(message, message.author.id, id)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                    case 8:
                        if (!(comando === "movimentos")) return [3 /*break*/, 10];
                        if (!args[1] || (args[1] != "receber" && args[1] != "enviar")) {
                            reply.description = "Aprende os comandos com **!comandos <movimentos>**";
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [4 /*yield*/, this.checkTransactions(message, message.author.id, id)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                    case 10:
                        if (!(comando === "cafezito")) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.cafezito(message, message.author.id)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                    case 12:
                        if (!(comando === "trabalhar")) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.work(message, message.author.id)];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Banco.prototype.checkBalance = function (message, username, UserID) {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, routes.checkBalance(UserID)];
                    case 1:
                        results = _a.sent();
                        if (!results.length) {
                            reply.fields = [
                                {
                                    name: "Conta",
                                    value: "**" + username + "**, ainda n\u00E3o tens nenhuma conta"
                                },
                                {
                                    name: "Sugestões",
                                    value: "Começa uma conta com os comandos !c `cafezito`,`trabalhar`\nOu pede que alguém te envie algum",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [2 /*return*/, results[0].Money];
                    case 2:
                        error_1 = _a.sent();
                        console.log("ERRO");
                        console.log(error_1);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Banco.prototype.transfer = function (bot, message, id, amount) {
        var amount;
        return __awaiter(this, void 0, void 0, function () {
            var origin, destination, currentMoney, transactionid, confirmation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        origin = message.author.id;
                        destination = bot.users.cache.find(function (u) { return u.username === id; }).id;
                        amount = amount;
                        return [4 /*yield*/, this.checkBalance(message, message.author.username, message.author.id)];
                    case 1:
                        currentMoney = _a.sent();
                        if (!currentMoney) {
                            return [2 /*return*/];
                        }
                        if (!id || !amount) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "!b enviar <user> <montante>"
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (currentMoney < amount) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "N\u00E3o tens " + amount + " \u20AC na conta"
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        _a.label = 2;
                    case 2:
                        transactionid =
                            "" + Math.floor(Math.random() * (999999 - 100000) + 100000);
                        _a.label = 3;
                    case 3: return [4 /*yield*/, routes.checkTransID(transactionid).length];
                    case 4:
                        if (_a.sent()) return [3 /*break*/, 2];
                        _a.label = 5;
                    case 5: return [4 /*yield*/, routes.createTransfer(transactionid, origin, destination, amount)];
                    case 6:
                        confirmation = _a.sent();
                        if (confirmation == 500) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "N\u00E3o foi possivel transferir, volta a tentar"
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        reply.fields = [
                            {
                                name: "Pendente",
                                value: "O " + id + " tem de confirmar a transa\u00E7\u00E3o " +
                                    "`" +
                                    ("" + transactionid) +
                                    "`",
                                inline: true
                            },
                        ];
                        reply.color = "#f1ca89";
                        return [2 /*return*/, message.channel.send({ embed: reply })];
                }
            });
        });
    };
    Banco.prototype.confirmTransfer = function (message, UserID, transactionid) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, routes.confirmTransfer(transactionid, UserID)];
                    case 1:
                        state = _a.sent();
                        console.log(state);
                        if (state === 404) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Transfer\u00EAncia " + transactionid + " n\u00E3o existe",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (state === 303) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "A origem n\u00E3o tem o dinheiro para a transfer\u00EAncia, Transfer\u00EAncia cancelada",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (state === 500) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Ocorreu um erro, tente novamente",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (state === 200) {
                            reply.fields = [
                                {
                                    name: "Concluido",
                                    value: "A transfer\u00EAncia " + transactionid + " foi concluida",
                                    inline: true
                                },
                            ];
                            reply.color = "#c6ffc1";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Banco.prototype.cancelTransfer = function (message, UserID, transactionid) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, routes.cancelTransfer(transactionid, UserID)];
                    case 1:
                        state = _a.sent();
                        if (state === 404) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Transfer\u00EAncia " + transactionid + " n\u00E3o existe",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (state === 500) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Ocorreu um erro, tente novamente",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (state === 200) {
                            reply.fields = [
                                {
                                    name: "Concluido",
                                    value: "A transfer\u00EAncia " + transactionid + " foi apagada",
                                    inline: true
                                },
                            ];
                            reply.color = "#c6ffc1";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Banco.prototype.checkTransactions = function (message, UserID, command) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reply.fields = [];
                        return [4 /*yield*/, routes.checkTransactions(UserID, command)];
                    case 1:
                        results = _a.sent();
                        console.log(results);
                        if (!results.length) {
                            reply.description = "N\u00E3o existem transa\u00E7\u00F5es a " + command;
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (!(command == "receber")) return [3 /*break*/, 3];
                        return [4 /*yield*/, results.forEach(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    reply.fields.push({
                                        name: "ID: " + transaction.TransactionID,
                                        value: transaction.Amount + " \u20AC\n" + command,
                                        inline: true
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        console.log(reply.fields);
                        reply.color = "#c6ffc1";
                        return [2 /*return*/, message.channel.send({ embed: reply })];
                    case 3: return [4 /*yield*/, results.forEach(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log(transaction);
                                reply.fields.push({
                                    name: "ID: " + transaction.TransactionID,
                                    value: transaction.Amount + " \u20AC\n" + command,
                                    inline: true
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                    case 4:
                        _a.sent();
                        console.log(reply.fields);
                        reply.color = "#c6ffc1";
                        return [2 /*return*/, message.channel.send({ embed: reply })];
                }
            });
        });
    };
    Banco.prototype.cafezito = function (message, UserID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, code, money;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, routes.cafezito(UserID)];
                    case 1:
                        result = _a.sent();
                        code = result.status;
                        money = result.data;
                        if (code === 404) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Ainda n\u00E3o passou 15 minutos.",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (code === 500) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Estamos a arranjar trocos, volta a tentar",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (code === 200) {
                            reply.fields = [
                                {
                                    name: "Concluido",
                                    value: "Recebeste " + money + "\u20AC para o caf\u00E9",
                                    inline: true
                                },
                            ];
                            reply.color = "#c6ffc1";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Banco.prototype.work = function (message, UserID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, code, money;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, routes.work(UserID)];
                    case 1:
                        result = _a.sent();
                        code = result.status;
                        money = result.data;
                        if (code === 404) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Ainda n\u00E3o passou 8h",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (code === 500) {
                            reply.fields = [
                                {
                                    name: "Erro",
                                    value: "Nada nos Linkedin, volta a tentar",
                                    inline: true
                                },
                            ];
                            reply.color = "#cf0000";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        if (code === 200) {
                            reply.fields = [
                                {
                                    name: "Concluido",
                                    value: "Recebeste " + money + "\u20AC pelo trabalho",
                                    inline: true
                                },
                            ];
                            reply.color = "#c6ffc1";
                            return [2 /*return*/, message.channel.send({ embed: reply })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Banco;
}());
exports.Banco = Banco;
