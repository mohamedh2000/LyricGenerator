import React from 'react'
import Button from '@material-ui/core/Button'
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Authenticated from './Authenticated';

export default class Genius extends React.Component{ 
    constructor(props) { 
        super(props);
    }
    
    async handleClick() { 
        const response = await fetch('/login');
        const res = await response.json();
        window.location.href = await res.url;
    }

    render() { 
        return (
            <Router> 
                <Route path="/" exact render={
                    () => {
                        return (<div>
                            <Button onClick={this.handleClick.bind(this)} style={{fontSize: 25, backgroundColor: "#FFDC00", borderRadius:10, fontFamily:"system-ui", top: window.innerHeight / 3, left: window.innerWidth / 2.2}}> Get Started!</Button>
                            </div>)}
                        }/>
                <Route path="/authenticated" exact strict render= { 
                    () => { 
                        return (
                            <div>
                            <Authenticated />
                            </div>
                        )
                    }
                } />

            </Router>
        )
        
        


    }
}