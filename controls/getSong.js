const fetch = require('node-fetch')

async function getCurrentSong(req, res) {
    const access_token = req.query.access_token
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', headers)
    const data = await response.json()

    return data
}

module.exports = getCurrentSong