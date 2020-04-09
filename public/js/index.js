const socket = io()
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')
const nameForm = document.getElementById('name-form')
const getName = document.getElementById('name-value')


// first name login
nameForm.addEventListener('submit', e => {
    e.preventDefault()
    const thisName = getName.value
    socket.emit('new-user', thisName)
})
appendMessage('You joined')

// connection new user 
socket.on('user-connected', data => {
    appendMessage(`${data} has joined the chat`)
})
socket.on('server message', data => {
    appendMessage(data)
})

// chat messages receving
socket.on('chat-message', data => {
    // console.log('chat', data)
    appendMessage(`${data.name}: ${data.newMsg}`)
})


// typing notification
messageInput.addEventListener('keypress', () => {
    socket.emit('typing')
})

// show typing
// socket.on('typing', (data) => {
//     console.log('client',data)
//     feedback.innerHTML = `<p><em>${data} is nu aan het typen...</em></p>`
// })
socket.on('command-message', data => {
    appendMessage(data.message, data.newMessage)
});
socket.on('user-disconnected', data => {
    appendMessage(`${data.name} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    let message = messageInput.value

    if (message[0] ==='/') {
        let sliceMsg = message.slice(3)
        console.log(sliceMsg)
        message = sliceMsg
        socket.emit('message command', sliceMsg)

    }
  
    socket.emit('send-chat-message', {
        message,
        name
    })
    messageInput.value = ''
})

function appendMessage(message, data) {
    const msgContainer = document.getElementById('messages')
    const msgElement = document.createElement('li')

    if (data) {
        msgElement.appendChild(appendGif(data))
        msgContainer.append(msgElement)
    } else {
        msgElement.innerText = message
        msgContainer.append(msgElement)
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// remove add username
const removeUsername = document.getElementById('username')
const usernameForm = document.querySelector('.enter-user')

removeUsername.addEventListener('click', () => {
    usernameForm.style.display = 'none'
})
// leave or reset button
const leaveButton = document.querySelector('#leave')
leaveButton.addEventListener('click', () => {
    usernameForm.style.display = "block"
})


//blacklist of words
let ul = document.querySelector('#messages')
let item = ul.querySelectorAll('li')

function whiteList(data) {
    console.log(data)
    if (data == "fuck") {
        appendMessage('nooo')
    }
}

function appendGif(data) {
    let dataImg = data[0].images.original.url
    let img = document.createElement('img')
    img.src = dataImg
    return img
}

