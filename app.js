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
var _this = this;
//Configs
require("dotenv").config();
var _a = require("./config.json"), prefix = _a.prefix, gameRoom = _a.gameRoom;
//Start bot
var _b = require("discord.js"), Client = _b.Client, Message = _b.Message, MessageEmbed = _b.MessageEmbed;
var bot = new Client();
bot.login(process.env.BOT_TOKEN);
//Music bot
var Quim = require("./comandos/Quim");
var LyriksClient = require("lyriks.js").LyriksClient;
//Banking bot
var BancoAPI = require("./comandos/Banco");
var Banco = new BancoAPI.Banco();
//Gambling bot
var FreeStuffApi = require("./comandos/freestuff").FreeStuffApi;
var freestuff = new FreeStuffApi({
    key: process.env.FREESTUFF_KEY
});
//Apresentar os novos jogos grátis
freestuff.on("free_games", function (gms) { return __awaiter(_this, void 0, void 0, function () {
    var info, games;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, freestuff.getGameList("free")];
            case 1:
                info = _a.sent();
                return [4 /*yield*/, freestuff.getGameDetails(info, "info")];
            case 2:
                games = _a.sent();
                info.forEach(function (id) {
                    var game = games[id];
                    var date;
                    var tempdate;
                    tempdate = game.until;
                    date =
                        tempdate.getDate() +
                            "/" +
                            tempdate.getMonth() +
                            1 +
                            "/" +
                            tempdate.getFullYear();
                    var rating = game.rating * 10;
                    var reply = new MessageEmbed()
                        .setColor("Random")
                        .setTitle("" + game.title)
                        .setDescription("" + game.description)
                        .addFields({
                        name: "Preço",
                        value: "~~\u20AC" + game.org_price.euro + "~~ **Gr\u00E1tis** at\u00E9 " + date,
                        inline: true
                    }, { name: "Rating", value: rating + "/10", inline: true }, { name: "Loja", value: "" + game.store })
                        .setURL("" + game.org_url)
                        .setImage("" + game.thumbnail.full);
                    bot.channels.cache
                        .get(bot.channels.cache.find(function (channel) { return channel.name === gameRoom; }).id)
                        .send(reply);
                });
                return [2 /*return*/];
        }
    });
}); });
bot.on("ready", function () {
    console.log("Já entrei, não me peças para sair!");
    console.log("Nome: " + bot.user.username + "\nTag: " + bot.user.tag);
});
bot.on("message", function (message) { return __awaiter(_this, void 0, void 0, function () {
    var song, song, song, song, page, song, section, reply, reply, info, games_1, channelID, reply, reply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (message.author.bot || !message.content.startsWith(prefix))
                    return [2 /*return*/];
                if (message.content === prefix + "ping") {
                    message.reply("pong");
                    return [2 /*return*/];
                }
                if (!message.content.startsWith(prefix + "play ")) return [3 /*break*/, 1];
                song = message.content.replace(prefix + "play ", "");
                Quim.play(message, song);
                return [2 /*return*/];
            case 1:
                if (!message.content.startsWith(prefix + "playnext")) return [3 /*break*/, 2];
                song = message.content.replace(prefix + "playnext ", "");
                Quim.playnext(message, song);
                return [2 /*return*/];
            case 2:
                if (!message.content.startsWith(prefix + "playnow")) return [3 /*break*/, 3];
                song = message.content.replace(prefix + "playnow ", "");
                Quim.playnow(message, song);
                return [2 /*return*/];
            case 3:
                if (!message.content.startsWith(prefix + "stop")) return [3 /*break*/, 4];
                Quim.stop(message);
                return [2 /*return*/];
            case 4:
                if (!message.content.startsWith(prefix + "info")) return [3 /*break*/, 5];
                Quim.info(message);
                return [2 /*return*/];
            case 5:
                if (!message.content.startsWith(prefix + "lyrics")) return [3 /*break*/, 6];
                song = message.content.replace(prefix + "lyrics", "");
                Quim.lyrics(message, song[0] === ' ' ? song.replace(" ", "") : 0, new LyriksClient());
                return [2 /*return*/];
            case 6:
                if (!message.content.startsWith(prefix + "steal")) return [3 /*break*/, 7];
                Quim.steal(message);
                return [2 /*return*/];
            case 7:
                if (!message.content.startsWith(prefix + "replay")) return [3 /*break*/, 8];
                Quim.replay(message);
                return [2 /*return*/];
            case 8:
                if (!message.content.startsWith(prefix + "shuffle")) return [3 /*break*/, 9];
                Quim.shuffle(message);
                return [2 /*return*/];
            case 9:
                if (!message.content.startsWith(prefix + "seek")) return [3 /*break*/, 10];
                Quim.seek(message, message.content.split(" ")[1]);
                return [2 /*return*/];
            case 10:
                if (!message.content.startsWith(prefix + "loopall")) return [3 /*break*/, 11];
                Quim.loopall(message);
                return [2 /*return*/];
            case 11:
                if (!message.content.startsWith(prefix + "loop")) return [3 /*break*/, 12];
                Quim.loop(message);
                return [2 /*return*/];
            case 12:
                if (!message.content.startsWith(prefix + "pause")) return [3 /*break*/, 13];
                Quim.pause(message);
                return [2 /*return*/];
            case 13:
                if (!message.content.startsWith(prefix + "resume")) return [3 /*break*/, 14];
                Quim.resume(message);
                return [2 /*return*/];
            case 14:
                if (!message.content.startsWith(prefix + "playlist")) return [3 /*break*/, 15];
                page = message.content.replace(prefix + "playlist", "");
                Quim.playlist(message, page[0] === ' ' ? page.replace(" ", "") : 1);
                return [2 /*return*/];
            case 15:
                if (!message.content.startsWith(prefix + "skipto ")) return [3 /*break*/, 16];
                song = message.content.replace(prefix + "skipto ", "");
                Quim.skipto(message, song);
                return [2 /*return*/];
            case 16:
                if (!(message.content === (prefix + "skip"))) return [3 /*break*/, 17];
                Quim.skip(message);
                return [2 /*return*/];
            case 17:
                if (!message.content.startsWith(prefix + "comandos")) return [3 /*break*/, 18];
                section = message.content.split(" ")[1];
                if ((section === "banco" || section === "casino" || section === "quim")) {
                    if (section === "banco") {
                        reply = new MessageEmbed()
                            .setColor("#233e8b")
                            .setTitle("Comandos banco")
                            .addFields([
                            {
                                name: '!b consultar',
                                value: 'Consultar o dinheiro da conta',
                                inline: false
                            },
                            {
                                name: '!b cafezito',
                                value: 'Dinheiro para o cafezito a cada 15 minutos até um máximo de 2 dias',
                                inline: false
                            },
                            {
                                name: '!b trabalhar',
                                value: 'Dinheiro a cada 8h',
                                inline: false
                            },
                            {
                                name: '!b enviar <utilizador> <montante>',
                                value: 'Enviar dinheiro a outro utilizador',
                                inline: false
                            },
                            {
                                name: '!b confirmar <transação>',
                                value: 'Confirmar a transação pendente',
                                inline: false
                            },
                            {
                                name: '!b cancelar <transação|todas>',
                                value: 'Cancelar uma ou todas as transações pendentes',
                                inline: false
                            },
                            {
                                name: '!b movimentos <receber|enviar>',
                                value: 'Ver transações pendentes',
                                inline: false
                            }
                        ]);
                    }
                    else if (section === "quim") {
                        reply = new MessageEmbed()
                            .setColor("#233e8b")
                            .setTitle("Comandos banco")
                            .addFields([
                            {
                                name: '!play <nome|link>',
                                value: 'Ouvir a música',
                                inline: false
                            },
                            {
                                name: '!playnext <nome|link>',
                                value: 'Adicionar a música ao topo da playlist',
                                inline: false
                            },
                            {
                                name: '!playnow <nome|link>',
                                value: 'Adicionar a música ao topo e começar a tocar',
                                inline: false
                            },
                            {
                                name: '!skip',
                                value: 'Saltar a música atual',
                                inline: false
                            },
                            {
                                name: '!stop',
                                value: 'Parar playlist',
                                inline: false
                            },
                            {
                                name: '!pause',
                                value: 'Fazer pause na música',
                                inline: false
                            },
                            {
                                name: '!resume',
                                value: 'Continuar a tocar',
                                inline: false
                            },
                            {
                                name: '!seek <segundos>',
                                value: 'Ouvir a música com inicio em <seg> segundos.',
                                inline: false
                            },
                            {
                                name: '!playlist <página>',
                                value: 'Ver a playlist atual do bot por página',
                                inline: false
                            },
                            {
                                name: '!loop',
                                value: 'Música em auto-repeat ON/OFF',
                                inline: false
                            },
                            {
                                name: '!loopall',
                                value: 'Playlist em auto-repeat ON/OFF',
                                inline: false
                            },
                            {
                                name: '!info',
                                value: 'Mostra a informação da música a tocar',
                                inline: false
                            },
                            {
                                name: '!steal',
                                value: 'DM do titulo da música',
                                inline: false
                            },
                            {
                                name: '!replay',
                                value: 'Tocar a música atual do inicio',
                                inline: false
                            },
                            {
                                name: '!lyrics <nome>',
                                value: 'Letra da música atual ou da especificada em <nome>',
                                inline: false
                            },
                            {
                                name: '!shuffle',
                                value: 'Playlist shuffle',
                                inline: false
                            },
                            {
                                name: '!skipto <número>',
                                value: 'Saltar para a música <número> da playlist',
                                inline: false
                            }
                        ]);
                    }
                    return [2 /*return*/, message.channel.send(reply)];
                }
                return [3 /*break*/, 22];
            case 18:
                if (!message.content.startsWith(prefix + "jogos")) return [3 /*break*/, 21];
                return [4 /*yield*/, freestuff.getGameList("free")];
            case 19:
                info = _a.sent();
                return [4 /*yield*/, freestuff.getGameDetails(info, "info")];
            case 20:
                games_1 = _a.sent();
                info.forEach(function (id) {
                    var game = games_1[id];
                    var date;
                    var tempdate;
                    tempdate = game.until;
                    date =
                        tempdate.getDate() +
                            "/" +
                            tempdate.getMonth() +
                            1 +
                            "/" +
                            tempdate.getFullYear();
                    var rating = game.rating * 10;
                    var reply = new MessageEmbed()
                        .setColor("Random")
                        .setTitle("" + game.title)
                        .setDescription("" + game.description)
                        .addFields({
                        name: "Preço",
                        value: "~~\u20AC" + game.org_price.euro + "~~ **Gr\u00E1tis** at\u00E9 " + date,
                        inline: true
                    }, { name: "Rating", value: rating + "/10", inline: true }, { name: "Loja", value: "" + game.store })
                        .setURL("" + game.org_url)
                        .setImage("" + game.thumbnail.full);
                    bot.channels.cache
                        .get(bot.channels.cache.find(function (channel) { return channel.name === gameRoom; }).id)
                        .send(reply);
                });
                channelID = bot.channels.cache.find(function (channel) { return channel.name === gameRoom; }).id;
                reply = new MessageEmbed()
                    .setColor("Random")
                    .addFields({ name: 'Os jogos estão no canal', value: "**<#" + channelID + ">**" });
                return [2 /*return*/, message.channel.send(reply)];
            case 21:
                if (message.content.startsWith(prefix + "b ")) {
                    Banco.execute(bot, message, message.content.replace(prefix + "b ", "").split(" "));
                    return [2 /*return*/];
                }
                else {
                    reply = new MessageEmbed()
                        .setColor("Random")
                        .setDescription("Aprende os comandos com **!comandos <quim|banco|casino>**");
                    return [2 /*return*/, message.channel.send(reply)];
                }
                _a.label = 22;
            case 22: return [2 /*return*/];
        }
    });
}); });
