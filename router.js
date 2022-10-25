import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node';
import request from 'request';
import dotenv from 'dotenv-defaults';
import axios from 'axios'

const ApiEndpoint = "https://api.t4ils.dev"
// define routes
const router = express.Router();

dotenv.config();

const client_id = 'ecee31ecc40b4cbeaa9a484cf222bb59'; // Your client id
const client_secret = '2f66f50359254ac79d91470b9d50d9e3'; // Your secret
const redirect_uri = 'http://localhost:8080'; // Your redirect uri
var token = ""

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        token = body.access_token;
    }
  });

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});


router.get('/', async(req,res) => {
    res.status(200).send("LOL");
})

router.get('/getArtistTracks', async(req, res) => {
    const artistName = req.query.artistName;
    spotifyApi.setAccessToken(token);
    const artistData = await spotifyApi.search(artistName,['artist']);
    const data = artistData.body.artists.items.slice(0,1);
    const id = data[0].id;
    const artistInfo = await axios.get(`${ApiEndpoint}/artistInfo?artistid=${id}`).then().catch()
    let albums = artistInfo.data.data.releases.albums.releases.map((e) => { 
      return {
        id: e.uri.split(":")[2], 
        name: e.name,
      }
    })
    for(let i = 0; i < albums.length; i++) {
      let thisAlbum = albums[i]
      const tracksData = await axios.get(`${ApiEndpoint}/albumPlayCount?albumid=${thisAlbum.id}`).then().catch();
      let tracks = tracksData.data.data.discs[0].tracks;
      tracks = tracks.map((e) => {
        return {
          id: e.uri.split(":")[2],
          name: e.name,
          playcount: e.playcount
        }
      })
      albums[i] = {
        id: thisAlbum.id,
        name: thisAlbum.name,
        tracks: tracks
      }
    }
    console.log("Fetch success");
    res.status(200).send(albums);
})

export default router