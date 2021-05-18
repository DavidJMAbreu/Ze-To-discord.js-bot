var express = require('express');
var router = express.Router();
var model = require("./models");



//Rota para verificar o balanço da conta
module.exports.checkBalance = async function (UserID) {
    let result = await model.checkBalance(UserID);

    return result.data
}


//Check transaction id
module.exports.checkTransID = async function (TransID) {
    let result = await model.checkTransID(TransID);

    return result.data
}

//Create a new transfer
module.exports.createTransfer = async function (transactionid, origin, destination, amount) {
    let result = await model.createTransfer(transactionid, origin, destination, amount);

    return result.status
}


module.exports.confirmTransfer = async function (transactionid, UserID) {

    //Verificar se a transação existe e é pendente do utilizador
    let existe = await (await model.checkTransfer(transactionid, UserID)).data;

    if (!existe.length) {
        return 404;
    }

    if (existe[0].Money < existe[0].Amount) {
        //Cancelar a transferência
        return 303;
    }

    let result = await model.confirmTransfer(transactionid);

    return result.status;
}



module.exports.cancelTransfer = async function (transactionid, UserID) {

    //Verificar se a transação existe e é pendente do utilizador
    if (transactionid != 'todas') {
        let existe = await (await model.checkTransfer(transactionid, UserID)).data;

        if (!existe.length) {
            return 404;
        }
    }

    let result = await model.cancelTransfer(transactionid, UserID);

    return result.status;
}



module.exports.checkTransactions = async function (UserID, command) {

    let result = await model.checkTransactions(UserID, command);
    return result.data;
}

module.exports.cafezito = async function (UserID) {

    let hasCoffee = (await model.cafezito(UserID)).data;

    if(!hasCoffee.length){
        return 404;
    }

    let time = hasCoffee[0].time;

    if(time>=2880){
        time = 2880;
    }

    let money = 0;
    for(var i = 0; i<Math.floor(time/15);i++){
        money += Math.random()*(30-15)+15;
    }

    let result = await model.drinkCoffee(UserID,money.toFixed(2));
    console.log(result.data)

    return { status: 200, data: money.toFixed(2) };
}

module.exports.work = async function (UserID) {

    let hasWork = (await model.work(UserID)).data;

    if(!hasWork.length){
        return 404;
    }


    let money = Math.random()*(1200-900)+900;

    let result = await model.gotoWork(UserID,money.toFixed(2));
    console.log(result.data)

    return { status: 200, data: money.toFixed(2) };
}

