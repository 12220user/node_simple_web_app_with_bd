const { Console } = require("console");
const fs = require("fs")
const mysql = require("mysql2");
require('events').EventEmitter.prototype._maxListeners = 0;
let isConnect = false
let connection = undefined

module.exports = {
    connect: (config) => {
        var obj = JSON.parse(fs.readFileSync(config, 'utf8'));
        connection = mysql.createConnection({
            host: obj.host,
            port: obj.port,
            user: obj.admin.name,
            database: obj.bd_name,
            password: obj.admin.pass
        });
        connection.connect((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Подключение к базе данных: успешно")
                isConnect = true
            }
        })
    },
    query: (sql, callback) => {
        if (isConnect) {
            connection.query(sql, (err, result, fields) => {
                callback(err, result, fields)
            })
        } else {
            console.log("Нет подключения к базе данных")
            callback("Нет подключения к базе данных", null, null)
        }
    }
}