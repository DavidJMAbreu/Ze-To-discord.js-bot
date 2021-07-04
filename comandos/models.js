//ligação à base de dados
const pool = require('./connection.js');




module.exports.checkBalance = async function (UserID) {
    try {
        let sql = "SELECT Money FROM bank WHERE UserID = ?";
        let dispositivos = await pool.query(sql, [UserID]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.checkTransID = async function (TransID) {
    try {
        let sql = "SELECT * FROM transactions WHERE TransactionID = ?";
        let dispositivos = await pool.query(sql, [TransID]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.createTransfer = async function (transactionid, origin, destination, amount) {
    try {
        let sql = "INSERT INTO transactions VALUES (?,?,?,?,'pending')";
        let dispositivos = await pool.query(sql, [transactionid, amount, origin, destination]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.confirmTransfer = async function (transactionid) {
    try {
        let sql = "CALL SP_transfer(?)";
        let dispositivos = await pool.query(sql, [transactionid]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}


module.exports.checkTransfer = async function (transactionid, UserID) {
    try {
        let sql = "SELECT * FROM transactions JOIN bank ON UserID = Origin WHERE TransactionID = ? AND Destination = ? AND State = 'pending'";
        let dispositivos = await pool.query(sql, [transactionid, UserID]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}



module.exports.cancelTransfer = async function (transactionid, UserID) {
    try {
        let dispositivos;
        if (transactionid == 'todas') {
            let sql = "DELETE FROM transactions WHERE TransactionID IN (SELECT Trans.TransactionID FROM (SELECT TransactionID FROM transactions WHERE Origin = ? OR Destination = ?) AS Trans)";
            dispositivos = await pool.query(sql, [UserID, UserID]);
        } else {
            let sql = "DELETE FROM transactions WHERE TransactionID = ?";
            dispositivos = await pool.query(sql, [transactionid]);
        }

        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.checkTransactions = async function (UserID, command) {
    try {
        let sql;
        if (command == 'receber') {
            sql = "SELECT * FROM transactions WHERE Destination = ? AND State = 'pending'";
        } else {
            sql = "SELECT * FROM transactions WHERE Origin = ? AND State = 'pending'";
        }

        let dispositivos = await pool.query(sql, [UserID]);
        return { status: 200, data: dispositivos };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}


module.exports.cafezito = async function (UserID) {
    try {

        let sql = "SELECT *,timestampdiff(MINUTE,lastCafe,now()) AS 'time' FROM bank WHERE UserID = ? AND timestampdiff(MINUTE,lastCafe,now())>14";
        
        let hasCoffee = await pool.query(sql, [UserID]);
        return { status: 200, data: hasCoffee };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.drinkCoffee = async function (UserID,money) {
    try {

        let sql = "UPDATE bank SET Money = Money + ?, lastCafe = now() WHERE UserID = ?";
        
        let result = await pool.query(sql, [money,UserID]);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}


module.exports.work = async function (UserID) {
    try {

        let sql = "SELECT * FROM bank WHERE UserID = ? AND timestampdiff(HOUR,lastTrabalho,now())>8";
        
        let hasCoffee = await pool.query(sql, [UserID]);
        return { status: 200, data: hasCoffee };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.gotoWork = async function (UserID,money) {
    try {

        let sql = "UPDATE bank SET Money = Money + ?, lastTrabalho = now() WHERE UserID = ?";
        
        let result = await pool.query(sql, [money,UserID]);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.createAccount = async function (UserID) {
    try {

        let sql = "insert into bank(UserID, Money) values (?,'635')";
        
        let result = await pool.query(sql, [UserID]);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.closeAccount = async function (UserID) {
    try {

        let sql = "DELETE FROM bank WHERE UserID = ?";
        
        let result = await pool.query(sql, [UserID]);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}


