const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

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


let user = []

io.on('connection', socket => {
    let thisUser
    console.log('Server side : a user connected')

    socket.on('new-user', name => {
        const newUser = {
            id: socket.id,
            name: name
        }
        user.push(newUser)
        thisUser = newUser
        io.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {
        console.log(message)
        io.emit('chat-message', message)
    })
    socket.on('disconnect', () => {
        console.log(thisUser)
        io.emit('user-disconnected', thisUser)
        delete thisUser
    })
})

http.listen(port, () => console.log('listening to:' + port))