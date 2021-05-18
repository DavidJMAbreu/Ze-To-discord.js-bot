//Configs
require("dotenv").config();
const { prefix, gameRoom } = require("./config.json");

//Start bot
const { Client, Message, MessageEmbed } = require("discord.js");
const bot = new Client();

bot.login(process.env.BOT_TOKEN);

//Music bot
const Quim = require("./comandos/Quim");

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
  } else if (message.content.startsWith(`${prefix}skip`)) {
    Quim.skip(message);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    Quim.stop(message);
    return;
  } else if (message.content.startsWith(`${prefix}seek`)){
    Quim.seek(message,message.content.split(" ")[1])
    return
  } else if (message.content.startsWith(`${prefix}loop`)){
    Quim.loop(message)
    return
  }  else if (message.content.startsWith(`${prefix}pause`)){
    Quim.pause(message)
    return
  }  else if (message.content.startsWith(`${prefix}resume`)){
    Quim.resume(message)
    return
  } else if (message.content.startsWith(`${prefix}playlist`)){
    Quim.playlist(message)
    return
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
                                          name: '!playlist',
                                          value: 'Ver a playlist atual do bot',
                                          inline: false
                                        },
                                        {
                                          name: '!loop',
                                          value: 'Playlist em auto-repeat ON/OFF',
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
