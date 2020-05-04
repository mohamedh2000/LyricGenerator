var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

var router = express.Router();
var cors = require('cors');
const request = require('request');
const client_id = 'VCR-O_TLVkWhBv7Nm9O-yD_FSCur6SFjNXf3xqtmGwWsOeEh_sZm8U-buiAvYkPY'
const client_secret = 'YFBIZYnedW8_JTEyWVfV49zj8FHyIMhacvrkfI9oA-RmRCjrWjnSeS05RphI5J5RyI73Mc4IsGR2m6hWLqW8gQ';
const tempCode = [];
let code = '';
let access_token = [];
const refresh_token = '';
const Lyricist = require('lyricist/node6');
const spotify_client_id= '3cbfbf7ef31e485db8be39772a06a667';
const spotify_secret= "cc65bd3ed3bb45b59c02fa883f3dfe5c";
let spotify_access_token = [];
//For Cors 
router.use( (req,res,next) => { 
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
})
router.use(cors());

//MongoDb/node.js driver

const {MongoClient} = require('mongodb');
const uri = 'mongodb+srv://Hussein:Sama1324@cluster0-o2tsj.mongodb.net/test?retryWrites=true&w=majority'
const client = new MongoClient(uri);

//newListing is the document to insert 
async function createListing(client, newListing) { 
  await client.db('SavedSongs').collection("SongsSaved").insertOne(newListing);
}

async function retrieveAllSaved(client) { 
  const result = await client.db('SavedSongs').collection("SongsSaved").find({}).toArray();
  return result;
}

async function deleteSaved(client, id) { 
  var mongodb = require('mongodb');
  await client.db('SavedSongs').collection("SongsSaved").deleteOne({_id:new mongodb.ObjectID(id)});
}

app.post('/save', (req,res) => { 
  const name = req.body.name;
  const lyrics = req.body.lyrics; 
  const song_src = req.body.song_src; 
  const display_info = req.body.display_info;
  console.log(display_info);

  async function main() { 
    //set up from : https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
    //create a constant for our connection URI. 
    try { 
      //connect to cluster
        await client.connect();
        await createListing(client, {
          name: name, 
          lyrics: lyrics, 
          song_src: song_src, 
          display_info: display_info
      });
    }
    catch(e) { 
      console.error(e);
    }
  }
  main().catch(console.error);
})

app.get('/retrieveSaved', (req, res) => { 

  async function main() { 
    try { 
      if (client.isConnected()) { 
        let listOfId = await retrieveAllSaved(client);
        res.json({
          results: listOfId
        });
      }
      else { 
        await client.connect().catch(error => console.error());
        let listOfId = await retrieveAllSaved(client);
        console.log(listOfId);

        res.json({
          results: listOfId
        });
      }
    }
    catch(e) { 
      console.error(e);
    }
  }
  main().catch(console.error);
})

app.post('/deleteList', (req, res) => { 
  id = req.body.id;
  console.log(id);
  async function main() { 
    try { 
      if (client.isConnected()) { 
        await deleteSaved(client,id);
      }
      else { 
        await client.connect().catch(error => console.error());
        await deleteSaved(client,id);
      }
    }
    catch(e) { 
      console.error(e);
    }
  }
  main().catch(console.error);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/users', (request, response) => { 
  const data = request.body;
  response.json({ 
    status: 'success', 
    latitude: data.lat, 
    longitude: data.lon
  });
});

app.get('/login', (req, res) => { 
  return res.json({ url: "https://api.genius.com/oauth/authorize?client_id=VCR-O_TLVkWhBv7Nm9O-yD_FSCur6SFjNXf3xqtmGwWsOeEh_sZm8U-buiAvYkPY&redirect_uri=http://localhost:3001/callback&scope=me&state=200&response_type=code"});
})

app.get('/callback', (req,res) => {
  const infoByApi = req.url;
  tempCode.push(infoByApi);
  stringTemp = tempCode[0];
  stringTemp2 = stringTemp.match('\[=](.*)[&]')[1];
  code = stringTemp2;
  return res.redirect('http://localhost:3000/authenticated')
});

app.get('/getInfo', (req,res) => { 
  url = 'https://api.genius.com/oauth/token'
  grant_type = "authorization_code"
  redirect_uri = "http://localhost:3001/callback"
  response_type = "code"

  const authOptions = { 
    method: 'POST', 
    url: url,
    headers: { 
      'Content-Type': 'application/json'
    },
    body: { 
      code: code,
      client_id: client_id,
      client_secret: client_secret, 
      redirect_uri: "http://localhost:3001/callback",
      response_type: "code",
      grant_type: "authorization_code",
    },
    json: true
  }
  
  request.post(authOptions, (error, response, body) => {
    
    if (!error && response.statusCode == 200) {
      access_token = body.access_token;
      var Body = [];
      
      var options = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        url: 'http://api.genius.com/account',
        json: true
      };
        request.get(options, (error, response, body) => { 
          if(!error && response.statusCode == 200) { 
            Body.push(body.response);
            res.send(body.response)
          }
          else { 
            console.log('error' + response.statusCode)       
          }
          });        
      }
      else {
        console.log("failed " + response.statusCode);
      }
    })
})

app.post('/search', (req, res) => { 
  console.log(req.body);
  var options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    url: 'http://api.genius.com/search?q=' + req.body.input,
    json: true
  };

  request.get(options, (error, res2, body) => { 
    let hash = new Map();
    let id = [];
    let artist_id = []

    if(!error && res2.statusCode == 200) {
      for(i = 0; i < body.response.hits.length; i++) { 
        id.push(body.response.hits[i].result.id);
        hash.set(body.response.hits[i].result.id, {title: body.response.hits[i].result.full_title, image: body.response.hits[i].result.song_art_image_url});
      }
      artist_id.push(body.response.hits[0].result.primary_artist);
      hash_Set = {}
      for(i = 0; i < id.length; i++) { 
        hash_Set[id[i]] = hash.get(id[i])
      }
      res.json({ 
        id_set: id,
        hash_set: hash_Set,
        artist_id: artist_id
      });
    }

    else { 
      console.log(error + res2.staatusCode);
    }
  
  })
})

app.post('/getSong', (req,res) => { 
  const song_id = req.body.input;

  var options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    url: 'http://api.genius.com/songs/' + song_id,
    json: true
  };

  const lyricist = new Lyricist(access_token);
  lyricist.song(song_id, { fetchLyrics: true }).then(song => {
    let lyrics = song.lyrics;

    request.get(options, (error,response,body) => { 
      if(!error && response.statusCode == 200) {
        let artist = body.response.song.primary_artist.name;
        let description= body.response.song.description.dom.children;
        let page_views = body.response.song.stats.pageviews;
        res.json({ 
          img: body.response.song.song_art_image_url,
          apple_mus_id: body.response.song.apple_music_id,
          apple_mus_player: body.response.song.apple_music_player_url,
          title: body.response.song.full_title,
          url: body.response.song.url,
          page_views: page_views,
          description: description,
          lyrics: lyrics,
          artist: artist
        })
      }
      else { 
        console.log(error);
      }
    })
  
  });
})

app.get('/getSpotify', (req,res) => {
  const Options = { 
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(spotify_client_id + ':' + spotify_secret).toString('base64'))
    },
    body: { 
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'client_credentials'
    },
  }
  
  request.post(Options, (error,response,body) => { 
    let results = JSON.parse(body);
    spotify_access_token.push(results.access_token);
    res.json({ 
      body:"successful!"
    })
  });
});

app.post('/getSpotifySong', (req,res) => { 
  let str = req.body.input;
  let newstr = str.replace(/\(.*$/, '');
  let newstr2 = newstr.replace(/by.*$/, '');
  let newstr3 = newstr2.replace(/ /gi, "%20");
  let str2 = req.body.artist;
  let newstr4 = str2.replace(/ /gi, "%20");
  let searchString = newstr3 + newstr4;
  let searchString2 = searchString.replace(/\./gi, "");
  let searchString3 = searchString2.replace(/[^\x00-\x7F]+/g,'')

  const Options = { 
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + spotify_access_token[0]
    },
    url: 'https://api.spotify.com/v1/search?q=' + searchString3 + '&type=track',
    json: true
  }
  
  request.get(Options, (error, response, body) => { 
    if (!error && response.statusCode == 200) { 
      console.log(body);
      song_id= body.tracks.items[0].id;
      src = 'https://open.spotify.com/embed/track/' + song_id
      res.json({
       song_src:src
      });
    }
    else { 
      console.log("eror here!" + error);
    }
  })

})



module.exports = router;
