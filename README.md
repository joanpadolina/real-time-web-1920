# Real-Time WebApplication

![Preview](https://i.imgur.com/Ig1ibat.png)
## [Live link](https://real-time-webapp.herokuapp.com/)

During this course you will learn how to build a **meaningful** real-time application. You will learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

## Table of Content

1. __[Chat Application socket.io assignment [wiki]](https://github.com/joanpadolina/real-time-web-1920/wiki/Chat-application)__
1. __[Goals](#goals)__
1. __[Installation](#installation)__
1. __[Concept](#concept)__
1. __[API](#api)__
1. __[Data](#data)__
1. __[Data lifecycle](#data-lifecycle)__
1. __[Events](#events)__
1. __[Dependencies](#dependencies)__
1. __[Features](#features)__
1. __[Sources](#sources)__
1. __[Credits](#credits)__

## Goals
- _Deal with real-time complexity_
- _Handle real-time client-server interaction_
- _Handle real-time data management_
- _Handle multi-user support_

## Installation

* Clone

```
git clone https://github.com/joanpadolina/real-time-web-1920.git
```
* NPM

```
npm install
```

* Server - starts server.js

```
npm run dev
```

* .env

```
CLIENT_ID='client id'
CLIENT_SECRET='client secret'
REDIRECT_URI='host redirection'
```

`node server.js listening on PORT: 5000`

## Concept

This Realtime webapplication is all about  Sharing is Caring. Making use of the Spotify API users can share theyre favorite songs or even listen to it together. The Application is also looking for the popularity of the song which then would be added as a recommendation for the users. 

## API

Spotify API is free to use if you have an account exisiting account. The authentication is via [OAuth 2.0](https://oauth.net/articles/authentication/) which needs te following:

1. Client Id
1. Client Secret
1. Redirect uri

The easy part of the whole access is probably getting a Developer account from [Spotify developer](https://developer.spotify.com/dashboard/). Creating an app in the __Dashboard__ and getting the keys.
> _*Note_ The redirect uri need to be added in the developer.spotify where you have added you application. And place the uri in the settings.

The Api itself needs to redirect you to spotify login screen. Here you can basically give authorication that the application can and may use data from the account that has been logged in.

### Enviroment 

To access the Spotify API there is set of keys that is __important__ to place in the enviroment file. This way only `you` have access to your linked account. The `.env`-file can be accessed using a packaged `npm i dotenv`.

Spotify Env-file Example: 
```env
CLIENT_ID='client id'
CLIENT_SECRET='client secret'
REDIRECT_URI='host redirection'
```

To use this in the server you only have to call it.

```js
// require package
require('dotenv').config()

// important to copy exactly from the env. The file is 
// space and case sensitive. *Note don't place "-" in then env, instead use under lines.
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI


```

### Endpoints

```
Base url: 
https://api.spotify.com/v1/me

Endpoints
/player/currently-playing

```

## Data

Data example
```json
timestamp: 1587389364804
context: null
artists: (2) [{…}, {…}]
name: "Say Less"
popularity: 58
is_playing: true
```


## Data lifecycle

![Lifecycle](https://github.com/joanpadolina/real-time-web-1920/blob/master/public/assets/img/data_life3.png)

## Events
* `'server message'` // on connect this message shows up
* `'new-user'` // if input has been filled for the username, this wil show up after
* `'user-connected'` // the message that get broadcasted at first login
* `'send-chat-message'` // triggers for the input chat
* `'chat-message'` // the message that is being send to be broadcasted
* `'message-command'` // some triggers for the api fetch
* `'command-message'` // the message that triggers the result from fetch
* `'disconnect'` // bye bye user
* `'search-spotify'`// input query for spotify search
* `'select song'`// select from dom
* `'add que'` // add to server to broadcast
* `'stream'`// start playing song
* `'remove from que'` // remove when audioplayer is done

## Dependencies
* cookie-parser
* cors
* dotenv
* ejs
* express
* node-fetch
* nodemon
* querystring
* request
* socket.io

## Features
// Must have
* Chat with eachother
* Usage of giphies
* Listen to a song together
* Make a playlist

// Wishlist
* Show who is currently listening to what song
* Make suggestions ( most played, popularity)
* Delete certain numbers from the playlist

## Sources

* [Manau](https://github.com/Mennauu/real-time-web-1819)
* [Kris](https://github.com/kriskuiper/real-time-web-1920)
* [Lien](https://github.com/nlvo/real-time-web-1920)
* [millisecond to seconds](https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript)
* [Socket.io](https://socket.io/)
* [Spotify Api](https://developer.spotify.com/)

## Credits
`Lien` // spotify authentication

`Mikael` // regex bad words

`Coen`  // mental support

`Daniel` // Datalifecycle feedback

`Leroy` // Datalifecycle feedback and issues



<!-- ## Curriculum

### Week 1 - Hello Server

Goal: Build and deploy a unique barebone real-time app  

[Exercises](https://github.com/cmda-minor-web/real-time-web-1819/blob/master/week-1.md)    
[Slides](https://docs.google.com/presentation/d/1EVsEFgBnG699nce058ss_PkVJROQXDp5wJJ-IRXvzTA/edit?usp=sharing)  


### Week 2 - Sharing is caring  

Goal: Store, manipulate and share data between server-client   

[Exercises](https://github.com/cmda-minor-web/real-time-web-1819/blob/master/week-2.md)    
[Slides](https://docs.google.com/presentation/d/1woKoY59D8Zcttna0FzfNjEtGtT8oXWi9b5LYlukRISM/edit?usp=sharing)


### Week 3 - Let’s take this show on the road 

Goal: Handle data sharing and multi-user support 

[Exercises](https://github.com/cmda-minor-web/real-time-web-1819/blob/master/week-3.md)  
[Slides](https://docs.google.com/presentation/d/1SHofRYg87bhdqhv7DQb_HZMbW7Iq1PtqxpdtZHMbMmk/edit?usp=sharing) -->


<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- ☝️ replace this description with a description of your own work -->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- This would be a good place for your data life cycle ♻️-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜  -->
