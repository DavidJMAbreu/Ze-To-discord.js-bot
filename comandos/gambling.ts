
/* O bot tem os seguintes jogos
    - Roleta
    - 4 em linha

    Comandos do bot (prefix = !gambling):
        -- NO GAMBLING --
        estatuto - Mostra as stats do jogador
        podio - Mostra os 3 melhores jogadores
        

        -- GAMBLING - ROULETTE --
        rouleta <vermelho|preto|verde> <dinheiro|fodati> - Apostar numa cor da roleta com um montante|all-in
        partir - Comando para partir a rouleta e iniciar uma nova(retira entre 25-250 do jogador para comprar uma nova)

        -- GAMBLING - 4 em linha --
        desafiar <jogador> <dinheiro|fodati|strip> - Desafiar um jogador para um jogo de 4 em linha com dinheiro|all-in|sem apostas
        borabora <jogo> - Aceitar o desafio feito, se for a dinheiro e dinheiro>carteira o jogador entre em all-in

        ....................

     */




const discordjs = require('discord.js');

export interface Player{
    name : string;
    money : number;
    profit? : number;
    lost? : number;
}

export class GamblingBot{

}