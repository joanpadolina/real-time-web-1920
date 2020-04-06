const socket = io('http://localhost:3000')
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')

const name = prompt('Who you is?')
appendMessage('You joined')

socket.emit('new-user', name )

socket.on('chat-message', data => {
    console.log(data)
    appendMessage(`${data.name}: ${data.message}`)
})
socket.on('user-connected', data => {
    console.log(data)
    appendMessage(`Hi, ${name}`)
})
socket.on('user-disconnect', name => {
    appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message){
    const msgContainer = document.getElementById('messages')
    const msgElement = document.createElement('li')
    msgElement.innerText = message
    msgContainer.append(msgElement)

}