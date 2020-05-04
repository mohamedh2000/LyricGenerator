import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom';
import DisplayInfo from './DisplayInfo';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import Route from 'react-router-dom/Route';
import Favorites from './Favorites';

export default class Authenticated extends React.Component { 
    constructor(props) { 
        super(props);
        this.state = { 
            name: '',
            picture: '',
            hash: [],
            overView: '',
            info: [],
            lyrics: '',
            loading: false, 
            song_src: ''
        }
        this.getInfo = this.getInfo.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.infoElement = React.createRef();
    }

    async handleClick2() { 

    }

    async getInfo() { 
        const r = await fetch('/getInfo');
        const response = await r.json();
        const spotifyResponse = await fetch('/getSpotify');   
        const spotResponse = await spotifyResponse.json();
        this.setState ({ 
            name: response.user.name,
            picture: response.user.photo_url 
        }, () => { console.log("name" + this.state.name)});
    }

    async componentDidMount() { 
        this.getInfo();
    }

    async handleClick() { 
        if (document.getElementById("hello") != null) {
            document.getElementById("hello").innerHTML = '';
        }
        document.getElementById("display_info").innerHTML = '';
        this.setState({ 
            hash: []
        })
        const search = await document.getElementById('get_input').value;
        const Options = { 
            method: 'POST', 
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: search
              }),
            json: true
        }
        const results = await fetch('/search', Options);
        const response = await results.json();

        for(let i = 0; i < response.id_set.length; i++) { 
            let k = response.id_set[i]

            let title = response.hash_set[k].title;
            let image = response.hash_set[k].image;

            this.setState(prevState => ({
                hash: [...prevState.hash, [image, title, k]]
            }))

            let z = document.createElement('img');
            let x = document.createElement('li');

            z.id="img_"+i;
            z.src = image;
            z.alt = "new";
            z.height="100";
            z.width="100";
            z.draggable = true;
            z.style.display = "block";
            z.style.alignContent = "center";
            x.style.display = "inline-block";
            x.style.textAlign = "center";

            x.appendChild(z);
            document.getElementById("display_info").appendChild(x);
            document.getElementById("img_"+i).addEventListener("mouseover", 
            () => {this.setState ({ 
                overView: this.state.hash[i][1]
            })});
            document.getElementById('img_'+i).addEventListener("mousedown",
            () => { 
                this.setState({ 
                    info: [],
                    lyrics: '',
                    loading: true,
                    song_src: ''
                });

                const Options = { 
                    method: 'POST', 
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        input: this.state.hash[i][2]
                      }),
                    json: true
                  }
                fetch('/getSong', Options).then((response) => response.json()).then((data) => 
                {
                    this.setState(prevState => ({
                        info: [...prevState.info, [data.img, data.title, data.url, data.page_views, data.description, data.artist]],
                        lyrics: data.lyrics,
                        loading: false
                    }));

                    const Options2 ={ 
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            input: data.title,
                            artist: data.artist
                        })
                    }
                    fetch('/getSpotifySong', Options2).then((response) => (response.json())).then((data) => {
                        this.setState({
                            song_src: data.song_src
                        })
                    this.infoElement.current.onInfoChange();
                    if( document.getElementById("replace") != null) { 
                        document.getElementById("return").removeChild(document.getElementById("replace"));
                    }
                    })
                });
            })
        }
    }

    render() { 
        return (
            <Router>
                <Route path="/authenticated" exact render= {
                    () => {
                        return (
                            <div id="return">
                            <div class="wrapper" position="relative" style={{marginTop:-4}}>
                                <input id="get_input" placeholder="Search" type="text" class="search" style={{ height: 30, fontSize:15, width: window.innerWidth - 100}}/>
                                <button onClick={this.handleClick.bind(this)} position="absolute" style={{width:92, height:window.innerHeight-647}}>Register</button>
                            </div>
                            <div id="hello" style={{position: "relative", textAlign: "center"}}>Hello {this.state.name}!</div>
                            <Link to="/authenticated/saved" style={{color: '#1DB954', textDecoration:"none", fontSize: 15, position: "relative", textAlign: "center", fontFamily:"system-ui", top:50}}> Favorites </Link>
                            <div id="add_to"style={{textAlign:"center"}}>
                                <ul id="display_info" position="relative" style={{textAlign:"center", display: "inline-block"}}></ul>
                            </div>
                            <p style={{textAlign: "center"}}>{this.state.overView}</p>
                            <div>
                                {this.state.loading ? 
                                <div style={{textAlign:"center", fontSize:16, ontFamily:"monospace"}}>
                                    <Loader type="Audio" color="#00BFFF" height={100} width={100} />
                                    Fetching Info...
                                </div>                                    
                                :
                                <DisplayInfo song_name={this.state.info[0]} song_src={this.state.song_src} info={this.state.info} lyrics={this.state.lyrics} loading={this.state.loading} ref={this.infoElement} />
                                }
                            </div>
                                
                            <img id="replace" src={this.state.picture} alt="new" style={{position: "absolute", bottom: 50}} height="100" width="100" />
                        </div>)}}/>
                <Route path="/authenticated/saved" exact render= { 
                    () => {
                        return (<div>
                            <Link to="/authenticated" style={{color: '#E16387', textDecoration:"none", fontSize: 15, position: "relative", textAlign: "center", fontFamily:"system-ui", top:50}}> Back to Search! </Link>                                
                            <Favorites />
                            </div>)}
                        }/>
                        </Router>)}
}
