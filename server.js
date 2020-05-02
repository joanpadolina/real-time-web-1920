require('dotenv').config()
const song = require('./controls/onconnect')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const jsdom = require('jsdom')

const cors = require('cors');
const cookieParser = require('cookie-parser')



const port = process.env.PORT

// routes

const loginSpotify = require('./controls/auth/login')
const callBack = require('./controls/auth/callback')
const onConnect = require('./controls/onconnect.js')
const spotify = require('./controls/spotify_api')
const getCurrentSong = require('./controls/getSong')
const searchRoute = require('./controls/spotify_fetch')

app
    .use(express.urlencoded({
        extended: true
    }))
    .use(express.static('public'))
    .set('view engine', 'ejs')
    .set('views', 'views')

app
    .use(cors())
    .use(cookieParser())
    .get('/', async (req, res) => {
       let searchSong =  await searchRoute.dataResponse(req, res)        
        // const song = await getCurrentSong(req, res)
        // io.on('connection', (socket) => {
        //     socket.local.emit('music player', {
        //         song
        //     })
        // })
        res.render('index')
    })
    .get('/login', spotify.loginSpotify)
    .get('/callback', spotify.callback)
    .get('/refresh-token', spotify.refreshToken)
    .get('/api/search', async(req,res) =>{
        await searchRoute.dataResponse(req,res)
    })

io.on('connection', onConnect)

http.listen(port, () => console.log('listening to:' + port))