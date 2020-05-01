const socket = io()
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')
const nameForm = document.getElementById('name-form')
const getName = document.getElementById('name-value')
const img = document.querySelector('img')
const searchSong = document.querySelector('#searchSongs')
const inputSong = document.querySelector('#numberSearch')
const songUl = document.getElementById('songs')



function getHashParams() {
    let hashParams = {}
    let e, r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)
    while (e = r.exec(q)) hashParams[e[1]] = decodeURIComponent(e[2])
    return hashParams
}

const params = getHashParams();
const access_token = params.access_token
const refresh_token = params.refresh_token

async function fetchWithToken(token) {
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    }
    const url = 'https://api.spotify.com/v1/me'
    const response = await fetch(url, options)
    const data = await response.json();
    return data
}

async function search(searchQuery) {

    const token = access_token
    const query = searchQuery

    const url = `https://api.spotify.com/v1/search?${query}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    return data

}



if (access_token) {

    async function init() {
        let data = await fetchWithToken(access_token)
        // console.log('data', data)

        socket.on('connect', () => {
            socket.emit('new-user', {
                name: data.display_name,
                image: data.images[0].url
            })
            img.src = `${data.images[0].url}`
        })

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            let message = messageInput.value

            if (message[0] === '/') {
                let sliceMsg = message.slice(3)
                console.log(sliceMsg)
                message = sliceMsg
                socket.emit('message command', sliceMsg)

            }

            socket.emit('send-chat-message', {
                message,
                name: data.display_name,
                image: data.images[0].url
            })
            messageInput.value = ''
        })


    }
    init()

}
// first name login

// nameForm.addEventListener('submit', e => {
//     e.preventDefault()
//     const thisName = getName.value
//     socket.emit('new-user', thisName)
// })

appendMessage('You joined')

// connection new user 
socket.on('user-connected', data => {
    console.log(data)
    appendMessage(`${data.name} has joined the chat`)
})
socket.on('server message', data => {
    appendMessage(data)
})

// chat messages receving
socket.on('own-message', data => {
    const msgContainer = document.getElementById('messages')
    let imgSrc = data.img
    let name = data.name
    let message = data.newMsg
    let className = "chat-one"

    chatMessage(imgSrc, name, message, className)

    msgContainer.scrollTop = msgContainer.scrollHeight;

})

function chatMessage(source, name, message, className) {
    const msgContainer = document.getElementById('messages')
    msgContainer.insertAdjacentHTML('beforeend', `
        <li>
        <div class="${className}">
        <img class="profile" src="${source}">
        <span>${name}</span>
        <p>
        ${message}
        </p>
        </div>
        </li>
        `)
}

socket.on('other-message', data => {

    let imgSrc = data.img
    let name = data.name
    let message = data.newMsg
    let className = "chat-two"

    chatMessage(imgSrc, name, message, className)

    msgContainer.scrollTop = msgContainer.scrollHeight;
})

// music 
// socket.on('music player', data => {
//     const artist = data.song.item.artists[0].name
//     const music = data.song.item.name
//     appendMessage(` is now listening to :${artist} - ${music}`)

// })

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

if (searchSong) {
    socket.on('search-spotify', async data => {
        const value = data
        const songFetch = await fetch(`/api/search?q=${value}`)
        const tracks = await songFetch.json()

        // const artistImg = tracks.album.images[0]
        // const name = tracks.artist[0].name
        // const title = tracks.name
        // let tryHard = tracks.forEach(item => console.log(item.artist))
        console.log('tracht',tracks.map(e => {
            return e
        //    return {
        //        artist : e.artist[0].name,
        //        song: e.name
        //    }
        }))
        return tracks
    })
}

socket.on('search-spotiy', data => {
    console.log(data,'haha')
})
function songList(name, title){
    songUl.insertAdjacentHTML('beforeend', `
    <li>
        <div class="album-contain">
        <div class="info">
        <span>${name}</span>
        <p>${title} </p>
        </div>
        </div>
    </li>`)
}
searchSong.addEventListener('submit', (e) => {
    e.preventDefault()
    let songValue = inputSong.value
    socket.emit('search-spotify', songValue)
})



async function appendMessage(message, data) {
    const msgContainer = document.getElementById('messages')
    const li = document.createElement('li')
    if (data) {
        li.appendChild(appendGif(data))
        msgContainer.append(li)
    } else {
        li.innerText = message
        li.classList.add('broad-chat')
        msgContainer.append(li)

    }
    broadCastDissaper()
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
    let div = document.createElement('div')
    div.appendChild(img)
    div.classList.add('contain-div')
    img.classList.add('gif-img')
    img.src = dataImg
    return div
}

function broadCastDissaper() {
    let cast = document.querySelectorAll('.broad-chat')
    cast.forEach((li) => {
        setTimeout(() => {
            // li.classList.remove('broad-chat')
            li.classList.replace('broad-chat', 'show-login')
        }, 5000)
        setTimeout(() => {
            li.remove()
        }, 5500)
    })

}

emitter.setMaxListeners()