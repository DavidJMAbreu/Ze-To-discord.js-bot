//Configs
require("dotenv").config();
const { prefix, gameRoom } = require("./config.json");

//Start bot
const { Client, Message, MessageEmbed } = require("discord.js");
const bot = new Client();

bot.login(process.env.BOT_TOKEN);

//Music bot
const Quim = require("./comandos/Quim");
const { LyriksClient } = require("lyriks.js")

//Banking bot
const BancoAPI = require("./comandos/Banco");
const Banco = new BancoAPI.Banco();
//Gambling bot


const FreeStuffApi = require("./comandos/freestuff").FreeStuffApi;
const freestuff = new FreeStuffApi({
  key: process.env.FREESTUFF_KEY,
});
//Apresentar os novos jogos grátis
freestuff.on("free_games", async (gms) => {
  const info = await freestuff.getGameList("free");
  const games = await freestuff.getGameDetails(info, "info");

  info.forEach((id) => {
    const game = games[id];
    let date: string;
    let tempdate: Date;
    tempdate = game.until;
    date =
      tempdate.getDate() +
      "/" +
      tempdate.getMonth() +
      1 +
      "/" +
      tempdate.getFullYear();

    let rating = game.rating * 10;

    var reply = new MessageEmbed()
      .setColor("Random")
      .setTitle(`${game.title}`)
      .setDescription(`${game.description}`)
      .addFields(
        {
          name: "Preço",
          value: `~~€${game.org_price.euro}~~ **Grátis** até ${date}`,
          inline: true,
        },
        { name: "Rating", value: `${rating}/10`, inline: true },
        { name: "Loja", value: `${game.store}` }
      )
      .setURL(`${game.org_url}`)
      .setImage(`${game.thumbnail.full}`);

    bot.channels.cache
      .get(bot.channels.cache.find((channel) => channel.name === gameRoom).id)
      .send(reply);
  });
});

bot.on("ready", () => {
  console.log("Já entrei, não me peças para sair!");
  console.log(`Nome: ${bot.user.username}\nTag: ${bot.user.tag}`);
});

bot.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  if (message.content === `${prefix}ping`) {
    message.reply("pong");
    return;
  }

  //Comandos  de música
  if (message.content.startsWith(`${prefix}play `)) {
    var song = message.content.replace(`${prefix}play `, "");

    Quim.play(message, song);
    return;
  } else if (message.content.startsWith(`${prefix}playnext`)) {
    var song = message.content.replace(`${prefix}playnext `, "");
    Quim.playnext(message, song);
    return;
  } else if (message.content.startsWith(`${prefix}playnow`)) {
    var song = message.content.replace(`${prefix}playnow `, "");
    Quim.playnow(message, song);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    Quim.stop(message);
    return;
  } else if (message.content.startsWith(`${prefix}info`)) {
    Quim.info(message);
    return;
  } else if (message.content.startsWith(`${prefix}lyrics`)) {
    var song = message.content.replace(`${prefix}lyrics`, "");
    Quim.lyrics(message,song[0]===' '?song.replace(` `, ""):0,new LyriksClient())
    return;
  } else if (message.content.startsWith(`${prefix}steal`)) {
    Quim.steal(message);
    return;
  } else if (message.content.startsWith(`${prefix}replay`)) {
    Quim.replay(message);
    return;
  } else if (message.content.startsWith(`${prefix}shuffle`)) {
    Quim.shuffle(message);
    return;
  } else if (message.content.startsWith(`${prefix}seek`)){
    Quim.seek(message,message.content.split(" ")[1])
    return
  } else if (message.content.startsWith(`${prefix}loopall`)){
    Quim.loopall(message)
    return
  } else if (message.content.startsWith(`${prefix}loop`)){
    Quim.loop(message)
    return
  } else if (message.content.startsWith(`${prefix}pause`)){
    Quim.pause(message)
    return
  } else if (message.content.startsWith(`${prefix}resume`)){
    Quim.resume(message)
    return
  } else if (message.content.startsWith(`${prefix}playlist`)){
    var page = message.content.replace(`${prefix}playlist`, "");
    Quim.playlist(message,page[0]===' '?page.replace(` `, ""):1)
    return
  } else if (message.content.startsWith(`${prefix}skipto `)){
    var song = message.content.replace(`${prefix}skipto `, "");
    Quim.skipto(message,song)
    return
  } else if (message.content === (`${prefix}skip`)) {
    Quim.skip(message);
    return;
  }else if (message.content.startsWith(`${prefix}comandos`)) {
    var section = message.content.split(" ")[1];
    if((section==="banco"||section==="casino"||section==="quim")){
      if(section==="banco"){
        var reply = new MessageEmbed()
                                      .setColor("#233e8b")
                                      .setTitle(`Comandos banco`)
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
                                      ])
      }else if(section==="quim"){
        var reply = new MessageEmbed()
                                      .setColor("#233e8b")
                                      .setTitle(`Comandos banco`)
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
                                      ])
      }


      return message.channel.send(reply);
    }
  } else if (message.content.startsWith(`${prefix}jogos`)) {
    const info = await freestuff.getGameList("free");
  const games = await freestuff.getGameDetails(info, "info");

  info.forEach((id) => {
    const game = games[id];
    let date: string;
    let tempdate: Date;
    tempdate = game.until;
    date =
      tempdate.getDate() +
      "/" +
      tempdate.getMonth() +
      1 +
      "/" +
      tempdate.getFullYear();

    let rating = game.rating * 10;

    var reply = new MessageEmbed()
      .setColor("Random")
      .setTitle(`${game.title}`)
      .setDescription(`${game.description}`)
      .addFields(
        {
          name: "Preço",
          value: `~~€${game.org_price.euro}~~ **Grátis** até ${date}`,
          inline: true,
        },
        { name: "Rating", value: `${rating}/10`, inline: true },
        { name: "Loja", value: `${game.store}` }
      )
      .setURL(`${game.org_url}`)
      .setImage(`${game.thumbnail.full}`);

    bot.channels.cache
      .get(bot.channels.cache.find((channel) => channel.name === gameRoom).id)
      .send(reply);
  });

    var channelID = bot.channels.cache.find(
      (channel) => channel.name === gameRoom
    ).id;
    var reply = new MessageEmbed()
      .setColor("Random")
      .addFields(
          {name: 'Os jogos estão no canal', value:`**<#${channelID}>**`}
      );
    return message.channel.send(reply);

  } else if(message.content.startsWith(`${prefix}b `)){
    Banco.execute(bot,message, message.content.replace(`${prefix}b `,"").split(" "));
    return;

  }else {
    var reply = new MessageEmbed()
      .setColor("Random")
      .setDescription(`Aprende os comandos com **!comandos <quim|banco|casino>**`);
    return message.channel.send(reply);
  }
});
