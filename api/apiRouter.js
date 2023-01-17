const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
//uuidv1()

let currentPassword = 'root'
let p_map = 'qwertyuioplkjhgfdsazxcvbnm1234567890'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function PasswordGenerator() {
    let pass = ''
    for (let i = 0; i < 32; i++) {
        pass += p_map[getRandomInt(p_map.length)]
    }
    currentPassword = pass
    console.log('Текущий пароль -> ' + pass)
}

function checkBodyContainParams(req, args) {
    let status = true
    args.forEach(e => {
        if (req.body[e] === undefined) {
            status = false
        }
    });
    return status
}

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};


module.exports = {
    ApiInit: function(app, bd, urlencodedParser) {
        console.log('Генератор паролей запушен, для любого изменнения данных в базе нужно в запросах указывать rulePass, код меняется каждые 10 минут.')
        PasswordGenerator()
        setTimeout(PasswordGenerator, 1000 * 60 * 10)

        app.get('/api/status', (req, res) => {
            res.json({
                'status': 'worked',
                'serverTime': new Date()
            })
        })

        app.get('/api/serverTime', (req, res) => {
            var dateTime = new Date();
            res.json({
                'serverTime': dateTime
            })
        })

        app.get('/api/demo', (req, res) => {
            bd.query(`SELECT * FROM demo`, (err, result, fields) => {
                console.log(result)
                res.json(result)
            })
        })

        app.get('/api/records/all', (req, res) => {
            bd.query(`SELECT * FROM records WHERE 1`, (err, result, fields) => {
                res.json(result)
            })
        })
        app.get('/api/records', (req, res) => {
            bd.query(`SELECT * FROM records WHERE status = 3`, (err, result, fields) => {
                res.json(result)
            })
        })


        app.get('/api/records/:recordID', (req, res) => {
            let id = req.params["recordID"]
            bd.query(`SELECT * FROM records WHERE record_id = '` + id + `' Limit 1;`, (err, result, fields) => {
                res.json(result[0])
            })
        })


        app.post('/api/records/edit', urlencodedParser, (req, res) => {
            if (!req.body) return req.sendStatus(400)
            if (!checkBodyContainParams(req, ['id', 'name', 'rulePass', 'author', 'RecordData', /*'date',*/ 'status'])) {
                res.json({ status: 'No contain all arguments, pls check documentation' })
            } else {
                if (req.body.rulePass == currentPassword) {
                    // date='${req.body.date}',
                    let sql = `
                    UPDATE records SET
                        name='${req.body.name}',
                        author='${req.body.author}',
                        
                        dateChange='${new Date().yyyymmdd()}',
                        status='${req.body.status}',
                        RecordData='${req.body.RecordData}' 
                        WHERE record_id = '${req.body.id}'
                    `
                    bd.query(sql, (err, result, fields) => {
                        if (err) {
                            res.json({ status: 'Some wrond! Check logs in app' })
                            console.log(err)
                        } else {
                            console.log('Записть изменина -> id : ' + req.body.id)
                            res.json({})
                        }
                    })
                } else res.json({ status: 'You don`t have rules to change records' })
            }
        })
        app.post('/api/records/create', urlencodedParser, (req, res) => {
            if (!req.body) return req.sendStatus(400)
            if (!checkBodyContainParams(req, ['name', 'rulePass', 'author', 'status', 'RecordData'])) {
                res.json({ status: 'No contain all arguments, pls check documentation' })
            } else {
                if (req.body.rulePass == currentPassword) {
                    let sql = `
                    INSERT INTO records(
                        record_id, name, author, date, dateChange, status, RecordData
                    )
                    VALUES(
                        '${uuidv1()}',
                        '${req.body.name}',
                        '${req.body.author}',
                        '${new Date().yyyymmdd()}',
                        '${new Date().yyyymmdd()}',
                        '${req.body.status}',
                        '${req.body.RecordData}'
                    )
                    `
                    bd.query(sql, (err, result, fields) => {
                        if (err) {
                            res.json({ status: 'Some wrond! Check logs in app' })
                            console.log(err)
                        } else {
                            console.log('Записть создана -> id : ' + req.body.id)
                            res.json({})
                        }
                    })
                } else res.json({ status: 'You don`t have rules to create records' })
            }
        })


        app.post('/api/records/delite', urlencodedParser, (req, res) => {
            //console.log(req.body)
            if (!req.body) return req.sendStatus(400)
            if (!checkBodyContainParams(req, ['id', 'rulePass'])) {
                res.json({ status: 'No contain all arguments, pls check documentation' })
            } else {
                if (req.body.rulePass == currentPassword) {
                    let sql = `
                        DELETE FROM records WHERE record_id = '${req.body.id}'
                    `
                    bd.query(sql, (err, result, fields) => {
                        if (err) {
                            res.json({ status: 'Some wrond! Check logs in app' })
                            console.log(err)
                        } else {
                            console.log('Записть безвозратно удалена -> id : ' + req.body.id)
                            res.json({})
                        }
                    })
                } else res.json({ status: 'You don`t have rules to delite records' })
            }
        })

        app.post('/api/passCheck', urlencodedParser, (req, res) => {
            if (!req.body) return req.sendStatus(400)
            if (!checkBodyContainParams(req, ['pass'])) {
                res.json({ status: 'No contain all arguments, pls check documentation' })
            } else {
                res.json({ result: req.body.pass == currentPassword })
            }
        })


        app.post('/api/records/filtred', urlencodedParser, (req, res) => {
            if (!req.body) return req.sendStatus(400)
            if (!checkBodyContainParams(req, ['filter', 'param'])) {
                res.json({ status: 'No contain all arguments, pls check documentation' })
            } else {
                let sql = ''
                switch (req.body.filter) {
                    case 'search':
                        sql = `SELECT * FROM records
                            WHERE name LIKE '%${req.body.param}%'
                            OR author LIKE '%${req.body.param}%'
                            OR RecordData LIKE '%${req.body.param}%'
                        `
                        break;
                    case 'sort':
                        sql = `SELECT * FROM records ORDER BY ${req.body.param}`
                        break;
                    case 'sortsearch':
                        if (req.body.arg == undefined) {
                            res.json({})
                        } else {
                            sql = `
                            SELECT * FROM records
                            WHERE name LIKE '%${req.body.param}%'
                            OR author LIKE '%${req.body.param}%'
                            OR RecordData LIKE '%${req.body.param}%'
                            ORDER BY ${req.body.arg}
                            `
                        }
                        break
                }

                bd.query(sql, (err, result, fields) => {
                    if (err) {
                        res.json({ status: 'Some wrond! Check logs in app' })
                        console.log(err)
                    } else {
                        res.json(result)
                    }
                })
            }
        })
    }
};