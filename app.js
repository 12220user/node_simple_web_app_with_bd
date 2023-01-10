const path = require('path')
const express = require('express')
const api = require('./api/apiRouter')


let app = express()
// Папка со всем фронтенд файлами
app.use(express.static(path.resolve(__dirname , 'public')))

// Базовая страница веб приложения
app.get('/' , (req, res)=>{
    res.sendFile(path.resolve(__dirname ,'public' , 'index.html'))
})

api.ApiInit(app)

app.listen(3000)