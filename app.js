const path = require('path')
const express = require('express')
const bodyParser = require("body-parser");
const api = require('./api/apiRouter')
const bd = require('./bd/bd_controler')

bd.connect(path.resolve(__dirname, 'bd', 'bd_config.json'))

let app = express()
    // Папка со всем фронтенд файлами
app.use(express.static(path.resolve(__dirname, 'public')))
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Базовая страница веб приложения
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'admin.html'))
})

api.ApiInit(app, bd, urlencodedParser)

app.listen(3000)