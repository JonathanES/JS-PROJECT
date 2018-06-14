import React, { Component } from 'react';
import './main.css';
import Search from './components/search/search';
import Thumbnails from './components/thumbnails/thumbnails';
import CreateAccount from './components/createAccount/createAccount';
import Login from './components/login/login'
import { read_cookie, delete_cookie } from 'sfcookies';
import moment from 'moment';
import Videos from './components/videos/videos';
import Comment from './components/comment/comment';
import Favorite from './components/favorite/favorite';
import Account from './components/account/account';


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
      register: false,
      thumbnails: [],
      searchValue: "",
      currentVideos: "",
      currentThumbnail: "",
      account: false,
      cookies: { isLogin: read_cookie('isLogin'), user: read_cookie('user'), expire: read_cookie('expire'), register: read_cookie('register') }
    };

    this.handleClick = this.handleClick.bind(this);
    this.cookieManagement = this.cookieManagement.bind(this);
  }
  changeStuff(data) {
    this.setState({ isLogin: data.isLogin, user: data.user });
  }
  changeThumbnail(data) {
    this.setState({ thumbnails: data.thumbnails, searchValue: data.searchValue, search: data.search, currentVideos: data.currentVideos, account: data.account,tryToLogin: false, register: false });
  }
  changeRegister(data) {
    this.setState({ isLogin: data.isLogin, user: data.user, register: data.register, tryToLogin: data.tryToLogin });
  }
  changeVideos(data) {
    if (data.account === undefined)
      this.setState({ currentVideos: data.currentVideos, search: data.search, currentThumbnail: data.currentThumbnail });
    else
      this.setState({ currentVideos: data.currentVideos, search: data.search, currentThumbnail: data.currentThumbnail, account: data.account });
  }


  handleClick(id, event) {
    switch (id) {
      case "connect":
        this.setState({ tryToLogin: true, register: false });
        break;
      case "disconnect":
        this.setState({ tryToLogin: false, user: {}, isLogin: false });
        delete_cookie('isLogin');
        delete_cookie('user');
        delete_cookie('expire');
        break;
      case "register":
        this.setState({ register: true, tryToLogin: false });
        break;
      case "account":
         this.setState({ account: true });
        break;
      case "logo":
        this.setState({register: false, tryToLogin: false, account: false, thumbnails: [], currentThumbnail: "", currentVideos: ""});
        break;
      default:
        break;
    }

    event.preventDefault();
  }

  cookieManagement() {
    let d = new Date();
    d = moment(d, "YYYY-MM-DD HH:mm");
    if (this.state.cookies.expire.length > 0)
      if (d.diff(this.state.cookies.expire, 'minutes') < 0)
        this.setState({ isLogin: this.state.cookies.isLogin, user: this.state.cookies.user.data, register: this.state.cookies.register });
      else {
        delete_cookie('isLogin');
        delete_cookie('user');
        delete_cookie('expire');
        delete_cookie('register');
      }
  }

  componentWillMount() {
    const that = this;
    fetch('/api/user/email/guest@gmail.com/pwd')
      .then(res => res.json())
      .then(function (user) {
        switch (user.status) {
          case "success":
            let obj = { email: user.data.email, password: user.data.password, pseudo: user.data.pseudo, id_user: user.data.id_user }
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
    this.cookieManagement();
  }

  render() {
    return (
      <div>
        <div className="header">
          <nav>
            <div id="menuToggle">
              <input type="checkbox" />
              <span></span>
              <span></span>
              <span></span>
              <ul id="menu">
                {this.state.isLogin === false && <a onClick={(e) => this.handleClick("connect", e)} id="connect" >Se connecter</a>}
                {this.state.isLogin === true && <a onClick={(e) => this.handleClick("account", e)} id="account">Mes vidéos </a>}
                {this.state.isLogin === true && <a className="red" onClick={(e) => this.handleClick("disconnect", e)} id="disconnect">Se déconnecter</a>}
                {this.state.isLogin === false && <a className="red" onClick={(e) => this.handleClick("register", e)} id="register">S'inscrire</a>}
              </ul>
            </div>
          </nav>
          <img id="logo" src="./Images/looptube_logo.svg" alt="logo" onClick={(e) => this.handleClick("logo", e)} />
          <div className="links">
            {this.state.isLogin === false && <a onClick={(e) => this.handleClick("connect", e)} id="connect" >Se connecter</a>}
            {this.state.isLogin === true && <a onClick={(e) => this.handleClick("account", e)} id="account">Mes vidéos </a>}
            {this.state.isLogin === true && <a className="red" onClick={(e) => this.handleClick("disconnect", e)} id="disconnect">Se déconnecter</a>}
            {this.state.isLogin === false && <a className="red" onClick={(e) => this.handleClick("register", e)} id="register">S'inscrire</a>}
          </div>
          {<Search id="search" thumbnails={this.changeThumbnail.bind(this)} />}
        </div>
        <div>
          {this.state.account === true && this.state.isLogin === true && <Account user={this.state.user} videos={this.changeVideos.bind(this)} />}
          {this.state.register === true && this.state.tryToLogin === false && <CreateAccount register={this.changeRegister.bind(this)} />}
          {this.state.isLogin === false && this.state.tryToLogin === true && <Login login={this.changeStuff.bind(this)} register={this.changeRegister.bind(this)} />}
          {this.state.currentVideos === "" && this.state.account === false && this.state.tryToLogin === false && this.state.register === false && <Thumbnails videos={this.changeVideos.bind(this)} login={this.state.isLogin} user={this.state.user} guest={this.state.guest} thumbnails={this.state.thumbnails} searchValue={this.state.searchValue} />}
          {this.state.search === false && this.state.account === false && this.state.tryToLogin === false && this.state.register === false && this.state.currentVideos !== "" && <Videos login={this.state.isLogin} id={this.state.currentVideos} user={this.state.user} guest={this.state.guest} thumbnail={this.state.currentThumbnail} />}
          {this.state.search === false && this.state.account === false && this.state.isLogin === true && this.state.tryToLogin === false && this.state.register === false && this.state.currentVideos !== ""  && <Favorite videos={this.state.currentVideos} user={this.state.user} />}
          {this.state.search === false && this.state.account === false && this.state.isLogin === true && this.state.tryToLogin === false && this.state.register === false && this.state.currentVideos !== ""  && <Comment user={this.state.user} videos={this.state.currentVideos} />}
        </div>
      </div>
    );
  }
}

export default App;
