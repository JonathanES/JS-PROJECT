import React, { Component } from 'react';
import './App.css';
import Thumbnails from './components/thumbnails/thumbnails';
import CreateAccount from './components/createAccount/createAccount';
import Login from './components/login/login'

class App extends Component {
  constructor() {
    super();
    this.state = {
        search: true,
        isLogin: false,
        user: {}
    };
  }
  changeStuff(data) {
    this.setState({isLogin: data.isLogin, user: data.user});
  }

  render() {
    return (
      <div className="App">

     <CreateAccount />
      <Login login={this.changeStuff.bind(this)} />
      { this.state.isLogin === true && <Thumbnails user={this.state.user}/> }
      </div>
    );
  }
}

export default App;
