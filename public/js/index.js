const socket = io()
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')

const name = prompt('Who this?')
appendMessage('You joined')

socket.emit('new-user', name)

socket.on('chat-message', data => {
    if (data.name != name) {
        appendMessage(`${data.name}: ${data.message}`)
    }

})
socket.on('user-connected', data => {
    console.log('user client ',data)
    appendMessage(`${data} has joined the chat`)
})
socket.on('user-disconnected', data => {
    appendMessage(`${data.name} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', {message, name})
    messageInput.value = ''
})

function appendMessage(message) {
    const msgContainer = document.getElementById('messages')
    const msgElement = document.createElement('li')
    msgElement.innerText = message
    msgContainer.append(msgElement)

}