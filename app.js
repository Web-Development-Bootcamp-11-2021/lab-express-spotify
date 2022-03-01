/* require('dotenv').config();

const express = require('express');
const hbs = require('hbs'); */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import * as hbs from 'hbs';
import dotenv from 'dotenv'
dotenv.config()
import SpotifyWebApi from 'spotify-web-api-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API:
      res.render('artist-search-results', { results: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', { albums: data.body.items });
    })
})

app.get('/tracks/:albumId', (req,res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', { tracks: data.body.items });
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
