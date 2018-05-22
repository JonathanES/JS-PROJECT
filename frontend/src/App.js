import React, { Component } from 'react';
import './App.css';
import Thumbnails from './components/thumbnails/thumbnails';

class App extends Component {
  constructor() {
    super();
    this.state = {
        search: true
    };
  }
  render() {
    return (
      <div className="App">
       <Thumbnails/>
      </div>
    );
  }
}

export default App;
