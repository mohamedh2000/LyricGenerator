import React from 'react';
import { Hidden } from '@material-ui/core';

export default class Favorites extends React.Component { 
    constructor(props) { 
        super(props);
        this.state = { 
            overView: '',
            id: [],
            name: [], 
            lyrics: [], 
            song_src: [], 
            display_info: [], 
            current_id: '',
            current_spot: ''
        }
    }

    async handleClicked() { 
        this.setState({ 
            overView: '', 
            id: [], 
            lyrics: [], 
            song_src: [], 
            display_info: [], 
            name: []
        })
        document.getElementById("put_here").innerHTML = "";
        this.getSetup();
        const Options = { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.current_id 
            }),
            json: true
        } 
        await fetch('/deleteList', Options);
    }

    async componentDidMount() { 
        await this.getSetup();
    }

    async getSetup() { 
        let send = await fetch('/retrieveSaved');
        let response = await send.json();
        console.log(response.results);

        for(let i = 0; i < response.results.length; i++) { 
            let id = response.results[i]._id;
            let name = response.results[i].name;
            let lyrics = response.results[i].lyrics; 
            let song_src = response.results[i].song_src; 
            let display_info = response.results[i].display_info;

            this.setState(prevState => ({
                id: [...prevState.id, id],
                name: [...prevState.name, name], 
                lyrics: [...prevState.lyrics, lyrics], 
                song_src: [...prevState.song_src, song_src], 
                display_info: [...prevState.display_info, display_info]
            }));

            //Display_InFo
            console.log(display_info);
            let li = document.createElement('li');
            li.id = "img_" + i;
            li.float = "left";
            li.style.float= "left";
            let description = document.createElement('img');
            description.src = display_info;
            description.width=100;
            description.height=100;
            description.style.display="inline-block";
            li.append(description);
            document.getElementById("put_here").appendChild(li);
            document.getElementById("img_"+i).addEventListener("mouseover", 
            () => {
                this.setState ({ 
                    overView: this.state.name[i]
                })
            });
            document.getElementById("img_" + i).addEventListener("mousedown", 
            () => { 
                this.setState({ 
                    current_id: this.state.id[i],
                    current_spot: i
                })
                document.getElementById('lyrics').innerHTML = this.state.lyrics[i];
                document.getElementById('lyrics').style.whiteSpace = "pre-wrap";
                document.getElementById('src').style.visibility="visible";
                document.getElementById('src').src = this.state.song_src[i];
            });
        }
    }

    render() { 
        return(
            <div style={{display:"block"}}>
                <div style={{textAlign:"center", position:"center"}}>
                    <ul id="put_here" position="center" style={{textAlign:"center", display: "inline-block", listStyle: "none", overflow:"auto"}}></ul>
                </div>
                <p style={{textAlign: "center"}}>{this.state.overView}</p>
                <button onClick={this.handleClicked.bind(this)}>Delete!</button>
                <div style={{position:"center", display:'block', textAlign:"center"}}>
                    <iframe id="src" visibility="hidden" style={{width:300, height:80, frameBorder:0, allowTransparency:true, allow:"encrypted-media", visibility:"Hidden"}}></iframe>
                    <p id="lyrics"></p>
                </div>

            </div>
        )
    }
}