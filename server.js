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

app
    .get('/', (req, res) => {
        res.render('index')
    })
    .get('/chat-room', (req, res) => res.render('pages/chat'))


io.on('connection', socket => {

    let user = []
    let thisUser
    let userAnon = 'anonymous'

    socket.emit('server message', `Someone is lurking`)
    socket.broadcast.emit('server message', `${userAnon} is connected`)

    console.log('Server side : a user connected')

    socket.on('new-user', name => {
        const newUser = {
            id: socket.id,
            name: name
        }
        user.push(newUser)
        thisUser = newUser

        socket.emit('user-connected', name)
        socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {

        let newMsg = blackList(message)

        socket.emit('chat-message', {
            name: 'You',
            newMsg,
        })
        async () => {
            let data = await get(message)
            console.log(data)
        }
        console.log(get(message))
        socket.broadcast.emit('chat-message', {
            name: thisUser.name,
            newMsg
        })
    })
    socket.on('message command', async message => {
        if (message[0] === '/') {
            message = await excommands(message, message)
            // console.log('command',message)
            // show command result to self
            socket.emit('command-message', {
                message,
                name: thisUser
            })

            // broadcast command result to others
            socket.broadcast.emit('command-message', {
                message,
                name: thisUser
            })
        }
    })
    // socket.on('typing', (data) => {
    //     io.emit('typing', thisUser.name)
    // })

    socket.on('disconnect', () => {
        // console.log(thisUser)
        io.emit('user-disconnected', thisUser)
        // delete thisUser
    })
})
const noNoWords = ['fuck', 'satan', 'kanker', 'kut']

function blackList(data) {
    // console.log(data)
    noNoWords.forEach(word => {
        data.message = data.message.replace(new RegExp(word, 'g'), ' no no')
    })
    return data.message
}

// commands for gifs
function excommands(command) {
    const commando = {
        '/gif': get(),
        '/giphy': get()
    }
    return commando[command]
}

function createGifElement() {

}
// get api
async function get(query) {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&limit=1&q=${query}`
    const gifies = await apiFetch(url)
    return gifies
}

// fetch url
async function apiFetch(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json
}

http.listen(port, () => console.log('listening to:' + port))