require('dotenv').config()
const song = require('./controls/onconnect')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const onConnect = require('./controls/onconnect.js')
const jsdom = require('jsdom')

const spotify = require('./controls/spotify_api')
const getCurrentSong = require('./controls/getSong')

const port = process.env.PORT

app
    .use(express.urlencoded({
        extended: true
    }))
    .use(express.static('public'))
    .set('view engine', 'ejs')
    .set('views', 'views')

app
    .use(spotify)
    .get('/', async (req, res) => {
        const song = await getCurrentSong(req, res)
        io.on('connection', (socket) => {
            socket.local.emit('music player', {
                song
            })
        })
        res.render('index')
    })

io.on('connection', onConnect)

http.listen(port, () => console.log('listening to:' + port))