require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

const SpotifyWebApi = require('spotify-web-api-node');

require("dotenv").config()




app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/artist-search", (req, res, next) => {
    const artistName = req.query.query; 
    spotifyApi
      .searchArtists(artistName) 
      .then((data) => {
        console.log("aqui tienes tus artistas", data)
        const artists = data.body.artists.items; 
        res.render("artist-search.hbs", { data: data.body });
      })
      .catch((err) => {
        console.log("no pude encontrar a los artistas", err);
        res.render("error");
      });
  });

  app.get("/albums/:artistId", (req, res, next) => {
    const artistID = req.params.id; 
    spotifyApi
    .getArtistAlbums(artistID)
    .then((data)  => {
      console.log("el album de tu artista", data.body)
      res.render("albums.hbs", {
        albums: data.body.items
      });
    })
    .catch((error) => {
      console.log("no se pudo encontrar el album")
      res.render("error")
    });
});

  app.get("/tracks/:id", (req, res, next) => {
const albumID = req.params.id;
spotifyApi
.getAlbumTracks(albumID)
.then ((data) => {
  console.log("aquí tienes canciones", data.body);
  res.render("tracks.hbs", {
    tracks: data.body.items
  })
  .catch((error) => {
    console.log("no hay canciones")
    res.render("error")
  })
})
  })
  

app.listen(5003, () => console.log('My Spotify project running on port 5003 🎧 🥁 🎸 🔊'));
