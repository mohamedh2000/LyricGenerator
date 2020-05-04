import React from 'react'
import { isObject } from 'util';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default class DisplayInfo extends React.Component { 
    constructor(props) { 
        super(props);
        this.state = { 
            name: this.props.song_name,
            display_info: this.props.info,
            lyrics: this.props.lyrics,
            song_src: this.props.song_src
        }
        this.onInfoChange = this.onInfoChange.bind(this);
    }

    async handleClick() { 
        const Options = { 
            method: 'POST', 
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.display_info[0][1],
                lyrics: this.state.lyrics, 
                song_src: this.state.song_src, 
                display_info: this.state.display_info[0][0], 
              }),
            json: true
          }
        await fetch('/save', Options);
    }

    onInfoChange() { 
        this.forceUpdate();
        this.setState ({ 
            name: this.props.song_name,
            display_info: this.props.info,
            lyrics: this.props.lyrics,
            loading: this.props.loading,
            song_src: this.props.song_src
        })
        let x = document.createElement('img');
        let y = document.createElement('div');
        
        //get Description of Song(might be more edge cases to consider)
        for (let i = 0; i < this.state.display_info[0][4].length; i++) {
            if (this.state.display_info[0][4][i] == "") { 
                continue;
            }
            else { 
                for (let j = 0; j < this.state.display_info[0][4][i].children.length; j++) { 
                    if (isObject(this.state.display_info[0][4][i].children[j])) { 
                        if (this.state.display_info[0][4][i].children[j].tag ="img") { 
                            if(this.state.display_info[0][4][i].children[j].children != null) {
                                for(let k = 0; k < this.state.display_info[0][4][i].children[j].children.length; k++) { 
                                    if (isObject(this.state.display_info[0][4][i].children[j].children[k])) { 
                                        if(this.state.display_info[0][4][i].children[j].children[k].tag == "br") {
                                            y.innerHTML += " ";
                                            continue;
                                        }
                                        if (isObject(this.state.display_info[0][4][i].children[j].children[k].children)) { 
                                            y.innerHTML += this.state.display_info[0][4][i].children[j].children[k].children[0];
                                        }
                                        else {
                                            y.innerHTML += this.state.display_info[0][4][i].children[j].children[k].children;
                                        }
                                    }
                                    else {
                                        y.innerHTML += this.state.display_info[0][4][i].children[j].children[k];
                                    }
                                }
                                continue;
                            }
                            else { 
                                continue;
                            }
                        }
                        if (isObject(this.state.display_info[0][4][i].children[j].children[0])) { 
                            y.innerHTML += this.state.display_info[0][4][i].children[j].children[0].children[0];
                            continue;
                        }
                        y.innerHTML += this.state.display_info[0][4][i].children[j].children[0];
                        continue;
                    }
                    else { 
                        y.innerHTML += this.state.display_info[0][4][i].children[j];
                    continue;
                    }
                }
            }
        }        

        x.src= this.state.display_info[0][0]
        x.width=350;
        x.height=350;
        document.getElementById("put_here").innerHTML="";

        let b = document.createElement('b');
        let h = document.createElement('h');
        h.innerHTML = 'Description: ';
        b.append(h);
        x.style.float="left";
        b.style.display="inline-block"
        let b2 = document.createElement('b');
        let h2 = document.createElement('h');
        h2.innerHTML = 'Lyrics: ';
        b2.append(h2);
        b2.style.display="inline-block"
        let lyr = document.createElement('body');
        lyr.innerHTML = this.state.lyrics;
        lyr.style.overflow="hidden";
        lyr.style.textOverflow="ellipsis";
        lyr.style.whiteSpace="pre-wrap";
        y.style.whiteSpace="pre-wrap";

        let newLi = document.createElement('p');
        newLi.innerHTML="";

        let iframe = document.createElement('iframe');
        iframe.src= this.state.song_src
        iframe.width="300";
        iframe.height="80";
        iframe.frameBorder="0"; 
        iframe.allowTransparency="true"; 
        iframe.allow="encrypted-media";
        iframe.style.float="right";
        
        document.getElementById("put_here").appendChild(x);
        document.getElementById("put_here").appendChild(b);
        document.getElementById("put_here").appendChild(y);
        document.getElementById("put_here").appendChild(newLi);
        document.getElementById("put_here").appendChild(iframe);
        document.getElementById("put_here").appendChild(b2);
        document.getElementById("put_here").appendChild(lyr);
        document.getElementById("put_here").style.display="inline-block";
    }
    
    render() { 
        return (
            <div> 
                <button onClick={this.handleClick.bind(this)}> Save!</button>
                <div id="put_here" class="w3-container"></div>
            </div>
            
        )
    }
}