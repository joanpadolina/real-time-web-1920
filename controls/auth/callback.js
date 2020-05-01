const generateRandomString = require('../generatestring')
const querystring = require('querystring')
const fetch = require('node-fetch')

module.exports = function (req, res) {


    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    console.log(getToken(code))

    if (state === null || state !== storedState) {
        res.redirect('/?' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        // request.post(authOptions, async function (error, response, body) {
        //     if (!error && response.statusCode === 200) {

        //         let access_token = body.access_token,
        //             refresh_token = body.refresh_token;

        //         let options = {
        //             url: 'https://api.spotify.com/v1/me',
        //             headers: {
        //                 'Authorization': 'Bearer ' + access_token
        //             },
        //             json: true
        //         };

        //         // use the access token to access the Spotify Web API
        //         request.get(options, function (error, response, body) {
        //             // console.log(body);
        //         });

        //         // we can also pass the token to the browser to make requests from there
        //         res.redirect('/?' +
        //             querystring.stringify({
        //                 access_token: access_token,
        //                 refresh_token: refresh_token
        //             }));
        //     } else {
        //         res.redirect('/?' +
        //             querystring.stringify({
        //                 error: 'invalid_token'
        //             }));
        //     }
        // });
    }
}

async function getToken(code) {

    const query = queryString.stringify({
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI
	});
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${encodeToBase64(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
		}
	};
    const url = `https://api.spotify.com/v1/me?${query}`
    
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
}

function encodeToBase64(text) {
	return Buffer.from(text).toString('base64')
}