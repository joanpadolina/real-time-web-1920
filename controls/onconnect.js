const get = require('./api')
const spotify = require('./spotify_api')
const SpotifyWebApi = require('spotify-web-api-node')
const getCurrentSong = require('./getSong')
const {
    addQue
} = require('./spotify_fetch')
const search = require('./spotify_fetch')
require('dotenv').config()


exports.socket = async (io) => {
    let queList = []
    io.on('connection', socket => {

        let user = []
        let thisUser
        let userAnon = 'anonymous'


        const updateQueList = () => {
            io.emit('add que', queList)
        }


        const removeAfterPlaying = (name) => {
            if (queList[0]) {
                if (queList[0].item.id === name) {
                    queList.shift()
                    updateQueList()
                }
            }
        }

        socket.emit('server message', `Someone is lurking`)
        socket.broadcast.emit('server message', `${userAnon} is connected`)

        console.log('Server side : a user connected')

        socket.on('new-user', data => {

            user.push(data)

            io.emit('user-connected', data)
        
        })

        socket.on('send-chat-message', message => {
            let newMsg = blackList(message)

            socket.emit('own-message', {
                name: 'You',
                newMsg,
                img: message.image
            })

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
            // socket.emit('select song', data)
        })
        socket.on('select song', data => {
            socket.emit('select song', data)
        })
        socket.on('add que', item => {
            queList.push({
                item
            })
            updateQueList()
        })
        socket.on('stream', (data) => {
            io.emit('stream', data)
        })

        socket.on('remove from que', (name) => {
            removeAfterPlaying(name)
        })
        // socket.on('typing', (data) => {
        //     io.emit('typing', thisUser.name)
        // })

        socket.on('disconnect', () => {
            socket.emit('user-disconnected', user)
        })

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
