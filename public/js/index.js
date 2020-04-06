const socket = io()
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')
const nameForm = document.getElementById('name-form')
const getName = document.getElementById('name-value')


nameForm.addEventListener('submit', e => {
    e.preventDefault()
    const thisName = getName.value
    console.log('client name:', thisName)
    socket.emit('new-user', thisName)
    socket.on('chat-message', data => {
        console.log('chat',thisName, data)
        if (data.name != thisName) {
            appendMessage(`${data.name}: ${data.message.message}`)
        }
    
    })
})
// console.log('testfdsfs',thisName)
appendMessage('You joined')

// socket.emit('new-user', name)

// socket.on('chat-message', data => {
//     console.log('chat',thisName)
//     if (data.name != data.name) {
//         appendMessage(`${data.name}: ${data.message}`)
//     }

// })
socket.on('user-connected', data => {
    console.log('user client ', data)
    appendMessage(`${data} has joined the chat`)
})
socket.on('user-disconnected', data => {
    appendMessage(`${data.name} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', {
        message,
        name
    })
    messageInput.value = ''
})

function appendMessage(message) {
    const msgContainer = document.getElementById('messages')
    const msgElement = document.createElement('li')
    msgElement.innerText = message
    msgContainer.append(msgElement)
}


const removeUsername = document.getElementById('username')
const usernameForm = document.querySelector('.enter-user')
    
removeUsername.addEventListener('click', ()=>{
    usernameForm.style.display = 'none'
})

const leaveButton = document.querySelector('#leave')

leaveButton.addEventListener('click', ()=>{
    usernameForm.style.display = "block"
})
console.log(leaveButton)