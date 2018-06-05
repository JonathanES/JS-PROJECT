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
        user: {},
        guest: {}
    };
  }
  changeStuff(data) {
    this.setState({isLogin: data.isLogin, user: data.user});
  }

  componentWillMount(){
    const that = this;
    fetch('/api/user/email/guest@gmail.com/pwd')
      .then(res => res.json())
      .then(function (user) {
        switch (user.status) {
          case "success":
          let obj = {email: user.data.email, password: user.data.password, pseudo: user.data.pseudo, id_user: user.data.id}
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
      <div className="App">

     <CreateAccount />
      {this.state.isLogin ===  false && <Login login={this.changeStuff.bind(this)} />}
      <Thumbnails login={this.state.isLogin} user={this.state.user} guest={this.state.guest}/> 
      </div>
    );
  }
}

export default App;
