import React, { Component } from 'react';
import './App.css';
import Thumbnails from './components/thumbnails/thumbnails';
import CreateAccount from './components/createAccount/createAccount';
import Login from './components/login/login'
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';


class App extends Component {
  constructor() {
    super();
    this.state = {
      search: true,
      isLogin: false,
      user: {},
      guest: {},
      tryToLogin: false,
      tryToCreateAccount: false,
      register: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  changeStuff(data) {
    this.setState({ isLogin: data.isLogin, user: data.user });
  }
  changeRegister(data) {
    this.setState({isLogin: data.isLogin, user: data.user, register: data.register });
  }


  handleClick(id, event) {
    switch (id) {
      case "connect":
        this.setState({ tryToLogin: true });
        break;
      case "disconnect":
        this.setState({ tryToLogin: false, user: {}, isLogin: false });
        delete_cookie('isLogin');
        delete_cookie('user');
        delete_cookie('expire');
        break;
      case "register":
        this.setState({ register: true });
        break;
      default:
        break;
    }

    event.preventDefault();
  }

  componentWillMount() {
    const that = this;
    fetch('/api/user/email/guest@gmail.com/pwd')
      .then(res => res.json())
      .then(function (user) {
        switch (user.status) {
          case "success":
            let obj = { email: user.data.email, password: user.data.password, pseudo: user.data.pseudo, id_user: user.data.id }
            that.setState({ guest: obj });
            break;
          case "mail not found":
            alert("mail not found");
            break;
          case "password not found":
            alert("password not found");
            break;
          default:
            break;
        }
      });
  }

  render() {
    return (
      <div>
        <div class="header">
          <img id="logo" src="./Images/looptube_logo.svg" />
          <input id="search-bar" type="text" placeholder="Rechercher une vidéo" />
          <button id="search-button"></button>
          <div class="links">
            {this.state.isLogin === false && <a href="#" onClick={(e) => this.handleClick("connect", e)} id="connect" >Se connecter</a>}
            {this.state.isLogin === true && <a class="red" href="#" onClick={(e) => this.handleClick("disconnect", e)} id="disconnect">Se déconnecter</a>}
            {this.state.isLogin === false && this.state.register === false && <a href="#" class="red" onClick={(e) => this.handleClick("register", e)} id="register">S'inscrire</a>}
          </div>
        </div>
        <div>
          {this.state.register === true && <CreateAccount register={this.changeRegister.bind(this)}/>}
          {this.state.isLogin === false && this.state.tryToLogin === true && <Login login={this.changeStuff.bind(this)} />}
          <Thumbnails login={this.state.isLogin} user={this.state.user} guest={this.state.guest} />
        </div>
      </div>
    );
  }
}

export default App;
