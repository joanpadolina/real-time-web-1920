const express = require('express')
const app = express()
const fetch = require('node-fetch')
const {
    encryptToJWT,
    decryptJWT
} = require('./lib/jtw');
const {
    cookies
} = require('./lib/cookie')

const request = require('request')
const generateRandomString = require('./generatestring')
const querystring = require('querystring')

const SpotifyWebApi = require('spotify-web-api-node')

require('dotenv').config()


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})



// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

// authentications
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI
const stateKey = 'spotify_auth_state'


// console.log(cookies)

function loginSpotify(req, res) {

    const state = generateRandomString(16)
    const scope = 'user-read-private user-read-email user-read-currently-playing'

    res.cookie(cookies.STATE_KEY, state)
    // res.cookie(stateKey, state)
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }))
}


async function callback(req, res, error) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[cookies.STATE_KEY] : null;

    const {access_token, refresh_token} = await getToken(code)

    let accessToken = encryptToJWT(access_token)

    res.cookie(cookies.ACCESS_TOKEN, accessToken)

    if (state === null || state !== storedState) {
        res.redirect('/?' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else{
        res.clearCookie(cookies.STATE_KEY);
        // getToken(code)
    }
    if (!error && response.statusCode === 200) {
       
    }
    res.redirect('/#' +
        querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        }));


    // else {
    //     res.clearCookie(stateKey);

    //     let authOptions = {
    //         url: 'https://accounts.spotify.com/api/token',
    //         form: {
    //             code: code,
    //             redirect_uri: redirect_uri,
    //             grant_type: 'authorization_code'
    //         },
    //         headers: {
    //             'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    //         },
    //         json: true
    //     };

    //     request.post(authOptions, async function (error, response, body) {
    //         if (!error && response.statusCode === 200) {

    //             let access_token = body.access_token,
    //                 refresh_token = body.refresh_token;

    //             let options = {
    //                 url: 'https://api.spotify.com/v1/me',
    //                 headers: {
    //                     'Authorization': 'Bearer ' + access_token
    //                 },
    //                 json: true
    //             }

    //             // use the access token to access the Spotify Web API

    //             request.get(options, function (error, response, body) {

    //                 let accessToken = encryptToJWT(access_token)
    //                 console.log(accessToken)

    //                 response.cookie(cookies.ACCESS_TOKEN = accessToken)

    //                 let searchQuery = 'billie'
    //                 searchSong(access_token, searchQuery)
    //             });

    //             // we can also pass the token to the browser to make requests from there
    //             res.redirect('/#' +
    //                 querystring.stringify({
    //                     access_token: access_token,
    //                     refresh_token: refresh_token
    //                 }));
    //         } else {
    //             res.redirect('/#' +
    //                 querystring.stringify({
    //                     error: 'invalid_token'
    //                 }));
    //         }
    //     });
    // }
}

function refreshToken(req, res) {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
}


async function getToken(code) {

    let authOptions = querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri
    })

    const url = `https://accounts.spotify.com/api/token?${authOptions}`

    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        }
    }

    const response = await fetch(url, option)

    const {
        access_token,
        refresh_token
    } = await response.json();
    
    return {
        access_token,
        refresh_token
    }
}

async function searchSong(token, searchQuery) {

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
    // console.log(data)
    return data

}

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
    console.log(data)
    return data

}

module.exports = {
    loginSpotify,
    callback,
    refreshToken,
    spotifyApi,
    searchSong,

}