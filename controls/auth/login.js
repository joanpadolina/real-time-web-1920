const request = require('request')
const generateRandomString = require('../generatestring')
const querystring = require('querystring')

require('dotenv').config()

// authentication

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI
const stateKey = 'spotify_auth_state'

module.exports = function (req, res) {
    
    const state = generateRandomString(16)
    const scope = 'user-read-private user-read-email user-read-currently-playing'

    res.cookie(stateKey, state)

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }))
}