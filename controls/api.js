const fetch = require('node-fetch')

// get api results
async function get(query) {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&limit=1&q=${query}`
    const gifies = await apiFetch(url)
    console.log(gifies)
    return gifies
}

// fetcher
async function apiFetch(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json
}

module.exports = get