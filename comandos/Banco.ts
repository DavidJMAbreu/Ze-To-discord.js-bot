import { Client } from "discord.js";

const mysql = require("mysql");
const routes = require("./routes.js");

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
const reply = {
  color: "cf0000",
  author: {
    name: "Caixa Geral dos Desgraçados",
    icon_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/62/Logo_CGD_Wikipedia.png",
  },
  fields: [],
  description: "",
};

export interface Account {
  userid: string;
  money: number;
}

export interface Transaction {
  transactionid: string;
  amount: number;
  origin: string;
  destination: string;
  state: string;
}

export class Banco {
  constructor() {
    console.log("Banco Aberto");
  }

  public async execute(bot: Client, message, args: string[]) {
    const comando = args[0];
    var id = args[1];
    var amount = args[2];

    if (
      !(
        comando === "consultar" ||
        comando === "confirmar" ||
        comando === "enviar" ||
        comando === "cancelar" ||
        comando === "movimentos"||
        comando === "cafezito"||
        comando === "trabalhar"
      )
    ) {
      reply.description = `Aprende os comandos com **!comandos <banco>**`;
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (comando === "consultar") {
      var money = await this.checkBalance(
        message,
        <string>message.author.username,
        <string>message.author.id
      );

      reply.fields = [
        {
          name: "Conta",
          value: `${message.author.username}`,
          inline: true,
        },
        {
          name: "Saldo",
          value: `${money} €`,
          inline: true,
        },
      ];
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }

    if (comando === "enviar") {
      if (!id || !amount) {
        reply.description = `Aprende os comandos com **!comandos <enviar>**`;
        reply.color = "#cf0000";
        return message.channel.send({ embed: reply });
      }
      await this.transfer(bot, message, id, amount);
      return;
    }

    if (comando === "confirmar") {
      if (!id) {
        reply.description = `Aprende os comandos com **!comandos <confirmar>**`;
        reply.color = "#cf0000";
        return message.channel.send({ embed: reply });
      }
      await this.confirmTransfer(message, <string>message.author.id, id);
      return;
    }

    if (comando === "cancelar") {
      if (!id) {
        reply.description = `Aprende os comandos com **!comandos <cancelar>**`;
        reply.color = "#cf0000";
        return message.channel.send({ embed: reply });
      }
      await this.cancelTransfer(message, <string>message.author.id, id);
      return;
    }

    if (comando === "movimentos") {
      if (!args[1] || (args[1] != "receber" && args[1] != "enviar")) {
        reply.description = `Aprende os comandos com **!comandos <movimentos>**`;
        reply.color = "#cf0000";
        return message.channel.send({ embed: reply });
      }
      await this.checkTransactions(message, <string>message.author.id, id);
      return;
    }

    if (comando === "cafezito") {
      await this.cafezito(message, <string>message.author.id);
      return;
    }

    if (comando === "trabalhar") {
      await this.work(message, <string>message.author.id);
      return;
    }
  }

  private async checkBalance(message, username: string, UserID: string) {
    try {
      let results = await routes.checkBalance(UserID);

      if (!results.length) {
        reply.fields = [
          {
            name: "Conta",
            value: `**${username}**, ainda não tens nenhuma conta`,
          },
          {
            name: "Sugestões",
            value:
              "Começa uma conta com os comandos !c `cafezito`,`trabalhar`\nOu pede que alguém te envie algum",
            inline: true,
          },
        ];
        reply.color = "#cf0000";
        return message.channel.send({ embed: reply });
      }

      return results[0].Money;
    } catch (error) {
      console.log("ERRO");
      console.log(error);
      return;
    }
  }

  private async transfer(bot, message, id, amount) {
    var origin = message.author.id;
    var destination = bot.users.cache.find((u) => u.username === id).id;
    var amount = amount;

    var currentMoney = await this.checkBalance(
      message,
      message.author.username,
      message.author.id
    );
    if (!currentMoney) {
      return;
    }

    if (!id || !amount) {
      reply.fields = [
        {
          name: "Erro",
          value: `!b enviar <user> <montante>`,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (currentMoney < amount) {
      reply.fields = [
        {
          name: "Erro",
          value: `Não tens ${amount} € na conta`,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    var transactionid;

    do {
      transactionid =
        "" + Math.floor(Math.random() * (999999 - 100000) + 100000);
    } while (await routes.checkTransID(transactionid).length);

    let confirmation = await routes.createTransfer(
      transactionid,
      origin,
      destination,
      amount
    );

    if (confirmation == 500) {
      reply.fields = [
        {
          name: "Erro",
          value: `Não foi possivel transferir, volta a tentar`,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    reply.fields = [
      {
        name: "Pendente",
        value:
          `O ${id} tem de confirmar a transação ` +
          "`" +
          `${transactionid}` +
          "`",
        inline: true,
      },
    ];
    reply.color = "#f1ca89";
    return message.channel.send({ embed: reply });
  }

  private async confirmTransfer(message, UserID, transactionid) {
    let state = await routes.confirmTransfer(transactionid, UserID);
    console.log(state);

    if (state === 404) {
      reply.fields = [
        {
          name: "Erro",
          value: `Transferência ${transactionid} não existe`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (state === 303) {
      reply.fields = [
        {
          name: "Erro",
          value: `A origem não tem o dinheiro para a transferência, Transferência cancelada`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (state === 500) {
      reply.fields = [
        {
          name: "Erro",
          value: `Ocorreu um erro, tente novamente`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (state === 200) {
      reply.fields = [
        {
          name: "Concluido",
          value: `A transferência ${transactionid} foi concluida`,
          inline: true,
        },
      ];
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }
  }

  private async cancelTransfer(message, UserID, transactionid) {
    let state = await routes.cancelTransfer(transactionid, UserID);

    if (state === 404) {
      reply.fields = [
        {
          name: "Erro",
          value: `Transferência ${transactionid} não existe`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (state === 500) {
      reply.fields = [
        {
          name: "Erro",
          value: `Ocorreu um erro, tente novamente`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (state === 200) {
      reply.fields = [
        {
          name: "Concluido",
          value: `A transferência ${transactionid} foi apagada`,
          inline: true,
        },
      ];
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }
  }

  private async checkTransactions(message, UserID, command) {
    reply.fields = [];
    let results = await routes.checkTransactions(UserID, command);
    console.log(results);
    if (!results.length) {
      reply.description = `Não existem transações a ${command}`;
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (command == "receber") {
      await results.forEach(async (transaction) => {
        reply.fields.push({
          name: `ID: ${transaction.TransactionID}`,
          value: `${transaction.Amount} €\n${command}`,
          inline: true,
        });
      });
      console.log(reply.fields);
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    } else {
      await results.forEach(async (transaction) => {
        console.log(transaction);
        reply.fields.push({
          name: `ID: ${transaction.TransactionID}`,
          value: `${transaction.Amount} €\n${command}`,
          inline: true,
        });
      });
      console.log(reply.fields);
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }
  }

  private async cafezito(message, UserID){
    var result = await routes.cafezito(UserID);
    var code = result.status;
    var money = result.data;

    if (code === 404) {
      reply.fields = [
        {
          name: "Erro",
          value: `Ainda não passou 15 minutos.`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (code === 500) {
      reply.fields = [
        {
          name: "Erro",
          value: `Estamos a arranjar trocos, volta a tentar`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (code === 200) {
      reply.fields = [
        {
          name: "Concluido",
          value: `Recebeste ${money}€ para o café`,
          inline: true,
        },
      ];
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }
  }

  private async work(message, UserID){
    var result = await routes.work(UserID);
    var code = result.status;
    var money = result.data;

    if (code === 404) {
      reply.fields = [
        {
          name: "Erro",
          value: `Ainda não passou 8h`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (code === 500) {
      reply.fields = [
        {
          name: "Erro",
          value: `Nada nos Linkedin, volta a tentar`,
          inline: true,
        },
      ];
      reply.color = "#cf0000";
      return message.channel.send({ embed: reply });
    }

    if (code === 200) {
      reply.fields = [
        {
          name: "Concluido",
          value: `Recebeste ${money}€ pelo trabalho`,
          inline: true,
        },
      ];
      reply.color = "#c6ffc1";
      return message.channel.send({ embed: reply });
    }
  }
}
