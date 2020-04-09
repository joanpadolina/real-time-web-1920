const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const onConnect = require('./controls/onconnect.js')

require('dotenv').config()
const port = process.env.PORT

app
    .use(express.urlencoded({
        extended: true
    }))
    .use(express.static('public'))
    .set('view engine', 'ejs')
    .set('views', 'views')

app
    .get('/', (req, res) => {
        res.render('index')
    })

io.on('connection', onConnect)

http.listen(port, () => console.log('listening to:' + port))