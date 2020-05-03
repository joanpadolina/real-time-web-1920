const fetch = require('node-fetch')
const querystring = require('querystring')
const {
    cookies
} = require('./lib/cookie')
const {
    decryptJWT
} = require('./lib/jtw')


async function search(req, searchQuery) {

    const token = decryptJWT(req.cookies[cookies.ACCESS_TOKEN])

    const query = querystring.stringify({
        q: searchQuery,
        type: 'track',
        market: 'from_token'
    })

    const url = `https://api.spotify.com/v1/search?${query}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const response = await fetch(url, options)
    const data = await response.json()
    const track = await data.tracks
    return track

}

async function addToQue(req, id){
    const token = decryptJWT(req.cookies[cookies.ACCESS_TOKEN])

    const query = querystring.stringify({id})
    const options = {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${decryptJWT(token)}`
		}
    }
    
    const response = await fetch(`https://api.spotify.com/v1/me/player/queue?${query}`, options)

}


async function dataResponse(req, res) {
    const searchQuery = req.query.q

    if (searchQuery) {
        const data = await search(req, searchQuery)

        res.json(data.items)
    }
    // const item = await res.json(data.tracks.items)
    // res.json(data.items)
}

module.exports = {
    dataResponse, addToQue
}