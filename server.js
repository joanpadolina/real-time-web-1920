const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(3000)

require('dotenv').config()
const port = process.env.PORT

app
    .use(express.urlencoded({
        extended: true
    }))
    .use(express.static('public'))
    .set('view engine', 'ejs')
    .set('views', 'views')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const user = {}

io.on('connection', socket => {

    console.log('Server side : a user connected')

    socket.on('new-user', name => {
        user[socket.id] = name
        socket.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        console.log(message)
        socket.emit('chat-message', {
            message: message,
            name: user[socket.id]
        })
    })
    socket.on('disconnect', () => {
        socket.emit('user-disconnect', user[socket.id])
        delete user[socket.id]
    })
})

http.listen(port, () => console.log('listening to:' + port))