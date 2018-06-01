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
        login: false
    };
  }
  changeStuff(paramsIfAny) {
    this.setState({login: paramsIfAny});
  }

  render() {
    return (
      <div className="App">

      {/*<CreateAccount />*/}
      <Login login={this.changeStuff.bind(this)} />
      { this.state.login === true && <Thumbnails/> }
      </div>
    );
  }
}

export default App;
