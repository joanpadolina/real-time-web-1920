const get = require('./api')

function onConnect(socket){

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
        socket.broadcast.emit('chat-message', {
            name: thisUser.name,
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
                message,newMessage: newMessage.data
            })

            // broadcast command result to others
            socket.broadcast.emit('command-message', {
                message,newMessage: newMessage.data
            })
        }
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