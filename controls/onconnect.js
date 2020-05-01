const get = require('./api')
const spotify = require('./spotify_api')
const SpotifyWebApi = require('spotify-web-api-node')
const getCurrentSong = require('./getSong')

const search = require('./spotify_fetch')
require('dotenv').config()

// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
// })

async function onConnect(socket) {

    let user = []
    let thisUser
    let userAnon = 'anonymous'

    socket.emit('server message', `Someone is lurking`)
    socket.broadcast.emit('server message', `${userAnon} is connected`)

    console.log('Server side : a user connected')

    socket.on('new-user', data => {
        // console.log('server', data)
        user.push(data)
        // console.log(newUser)
        socket.emit('user-connected', data)
        socket.broadcast.emit('user-connected', data)
    })

    socket.on('send-chat-message', message => {
        let newMsg = blackList(message)
        socket.emit('own-message', {
            name: 'You',
            newMsg,
            img: message.image
        })
        // async () => {
        //     let data = await get(message)
        //     console.log('hi',data)
        // }
        socket.broadcast.emit('other-message', {
            name: message.name,
            img: message.image,
            newMsg
        })
    })
    socket.on('message command', async message => {
        const commando = [
            '/g'
        ]
        // check in the command array
        if (commando.indexOf(message) == -1) {
            let newMessage = message.slice(3)
            newMessage = await get(message)

            // show command result to self
            socket.emit('command-message', {
                message,
                newMessage: newMessage.data
            })

            // broadcast command result to others
            socket.broadcast.emit('command-message', {
                message,
                newMessage: newMessage.data
            })
        }
    })
    socket.on('search-spotify', async (data) => {
        socket.emit('search-spotify', data)
    })
    socket.on('select song', data => {
        console.log('yeet', data)
    })
    // socket.on('typing', (data) => {
    //     io.emit('typing', thisUser.name)
    // })

    socket.on('disconnect', () => {
        socket.emit('user-disconnected', thisUser)
    })
}




// mikael helped with the regex
function blackList(data) {
    const noNoWords = ['fuck', 'satan', 'kanker', 'kut', 'cunt', 'fck', 'FUCK', 'Fuck']

    noNoWords.forEach(word => {
        data.message = data.message.replace(new RegExp(word, 'g'), '****')
    })
    return data.message
}



module.exports = onConnect