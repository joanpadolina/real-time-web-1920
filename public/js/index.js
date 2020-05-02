const socket = io()
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('input-msg')
const nameForm = document.getElementById('name-form')
const getName = document.getElementById('name-value')
const img = document.querySelector('img')
const searchSong = document.querySelector('#searchSongs')
const inputSong = document.querySelector('#numberSearch')
const songUl = document.getElementById('songs')
const queList = document.getElementById('que')
const audioPlayer = document.getElementById('audioPlayer');



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
    return data

}

async function cleanUserData(token) {
    let data = await fetchWithToken(token)
    // console.log(data)
    let user = {
        name: data.display_name
    }
    if (data.images[0]) {
        user.img = data.images[0].url
    } else {
        user.img = "https://www.groningen-seaports.com/wp-content/uploads/placeholder.jpg"
    }
    return user
}


if (access_token) {

    async function init() {
        // let data = await fetchWithToken(access_token)
        let data = await cleanUserData(access_token)
        // console.log('data', data)

        socket.on('connect', () => {
            socket.emit('new-user', {
                name: data.name,
                image: data.img
            })
            img.src = `${data.img}`
        })
        // connection new user 
        socket.on('user-connected', data => {
            appendMessage(`${data.name} has joined the chat`)
        })
        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            let message = messageInput.value

            if (message[0] === '/') {
                let sliceMsg = message.slice(3)
                message = sliceMsg
                socket.emit('message command', sliceMsg)

            }

            socket.emit('send-chat-message', {
                message,
                name: data.name,
                image: data.img
            })

            messageInput.value = ''
        })

        socket.on('server message', data => {
            appendMessage(data)
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

// // connection new user 
// socket.on('user-connected', data => {
//     console.log(data)
//     appendMessage(`${data.name} has joined the chat`)
// })

// chat messages receving
socket.on('own-message', data => {
    const msgContainer = document.getElementById('messages')
    let imgSrc = data.img
    let name = data.name
    let message = data.newMsg
    let className = "chat-one"
    let nameProfile = "profile-one"

    chatMessage(imgSrc, name, message, className, nameProfile)

    msgContainer.scrollTop = msgContainer.scrollHeight;

})

function chatMessage(source, name, message, className, nameProfile) {
    const msgContainer = document.getElementById('messages')
    msgContainer.insertAdjacentHTML('beforeend', `
        <li>            
            <img class="${nameProfile}" src="${source}">
            <div class="${className}">
                <span>${name}</span>
                <p>
                ${message}
                </p>
            </div>
        </li>
        `)
}

socket.on('other-message', data => {
    const msgContainer = document.getElementById('messages')
    let imgSrc = data.img
    let name = data.name
    let message = data.newMsg
    let className = "chat-two"
    let nameProfile = "profile-two"

    chatMessage(imgSrc, name, message, className, nameProfile)

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


// song inputvalue
searchSong.addEventListener('submit', async (e) => {
    e.preventDefault()
    let songValue = inputSong.value
    let songs = await fetchSongs(songValue)

    removePreviousResulst(songUl)
    appendSongToList(songs)


    // for(let song of songs){
    //     let id = song.id
    //     console.log(song)
    // }

    socket.emit('search-spotify', {
        songValue
    })
    socket.emit('select song', songs)
})

socket.on('select song', data => {
    let list = document.querySelectorAll('.tracks')
    list.forEach(i => {
        i.addEventListener('click', () => {
            for (let song of data) {
                if (i.id == song.id) {
                    socket.emit('add que', song)
                }

            }

        })
    })
})
socket.on('add que', data => {
console.log(data,'quesd')
    appendSongToQue(data)
    // socket.emit('quelist', data)
    socket.emit('stream', data)

})

socket.on('stream', data => {
    // let nestedData = data[0].item
    console.log(data,'joan')
    // audioPlayer.play()
    // console.log(audioPlayer.currentTime)
    console.log('stream', data.length)
    if (data.length) {
        console.log(data[0],'firstdata')
            if (audioPlayer.currentTime == 0) {
                if (data[0].item.preview) {
                    console.log(data[0].item.preview)
                    audioPlayer.src = data[0].item.preview
                    const promise = audioPlayer.play()

                    if (promise !== undefined) {

                        promise.then(_ => {
                            // Autoplay started!
                        }).catch(error => {
                            // console.log(error)
                        })
                    }
                }
            }

        // console.log(nestedData)
        audioPlayer.onended = function () {
            audioPlayer.currentTime = 0
            console.log(data.length, data,'nested')
            if (data.length > 0) {
                socket.emit('remove from que', data[0].item.id)
            }
        }

    }

    // audioPlayer.onended = function () {
    //     audioPlayer.currentTime = 0

    //     if (data.length > 0) {
    //         socket.emit('remove from que', data.name)
    //     }
    // }
})
// if (searchSong) {
//     socket.on('search-spotify', async data => {
//         let songs = await fetchSongs(data)
//         console.log('hier',songs)
//         appendSongToList(songs)
//         socket.emit('search-spotify', {songs})
//     })
// }
// socket.on('select song', async data => {
//     let songs = await fetchSongs(data)
//     // for(let song of songs){
//     //     let id = song.id
//     //     console.log(song)
//     //   id.addEventListener('click', ()=>{
//     //       console.log('this')
//     //   })
//     // }
//     // const songlist = document.getElementById('songs')
//     console.log('help', songs)
//     socket.emit('select song', songs)
// })





// fetch songs 
async function fetchSongs(data) {
    const value = data
    const songFetch = await fetch(`/api/search?q=${value}`)
    const tracks = await songFetch.json()
    const newData = await cleanData(tracks)
    return newData
}
// clean tracks
async function cleanData(data) {
    // console.log(data)
    let tracks = await data.map(item => {
        return {
            id: item.id,
            artists: item.artists[0].name,
            song: item.name,
            img: item.album.images[0].url,
            preview: item.preview_url,
            duration: msToMinutes(item.duration_ms),
            popularity: item.popularity
        }
    })
    return tracks
}

// creating list out of tracks
async function appendSongToList(tracks) {
    let data = await tracks
    data.forEach(item => {

        if (item.preview != null) {
            songUl.insertAdjacentHTML('beforeend', `
        <li class="tracks" id="${item.id}">
            <img class="albumcover" src="${item.img}">
            <div class="info">
                    <h2>
                    ${item.artists} 
                    </h2>
                    <p>
                    ${item.song}
                    </p>
                    <span>duration: ${item.duration}</span>
            </div>
        </li>`)
        }
    })
}


// creating  playlist
async function appendSongToQue(tracks) {
    //https://github.com/Mennauu/real-time-web-1819 from menau's code Concept: newMap
    let newMap = [...new Map(tracks.map(obj => [JSON.stringify(obj), obj])).values()]
    // console.log(newMap)

    let addQue

    for (let data of newMap) {
        let item = data.item
        if (item.preview != null) {
            addQue += `
        <li class="tracks" id="${item.id}">
        <img class="albumcover" src="${item.img}">
        <div class="info">
                <h2>
                ${item.artists} 
                </h2>
                <p>
                ${item.song}
                </p>
                <span>duration: ${item.duration}</span>
        </div>
    </li>`
        }
    }


    queList.innerHTML = addQue
    // data.forEach(item => {
    //     queList.insertAdjacentHTML('beforeend', `
    //     <li class="tracks" id="${item.id}">
    //         <img class="albumcover" src="${item.img}">
    //         <div class="info">
    //                 <h2>
    //                 ${item.artists} 
    //                 </h2>
    //                 <p>
    //                 ${item.song}
    //                 </p>
    //                 <span>duration: ${item.duration}</span>
    //         </div>
    //     </li>`)
    // })

}

// insert song results to DOM
function songList(name, title) {
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



// broadcast messages
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
// giphy add on command
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

//animation for userconnection
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

// remove previous search results
// Kris Kuipers
function removePreviousResulst(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// ms to minutes
//https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function msToMinutes(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
emitter.setMaxListeners()