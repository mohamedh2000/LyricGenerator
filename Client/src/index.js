import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Clock from './App';
import * as serviceWorker from './serviceWorker';
import AppBar from '@material-ui/core/AppBar'
import Genius from './genius';

ReactDOM.render(
  <React.StrictMode>
    <topAppBar />
    <AppBar style={{position:"relative"}}>
      <div style={{fontSize: 25, textAlign: "center", fontFamily:"Chalkduster"}}>Welcome!</div>
    </AppBar>
     <Genius />
    <div style={{position: "absolute", bottom:5}}> 
      <Clock />
    </div>
  </React.StrictMode>,
  document.getElementById('root')

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
