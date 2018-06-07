import React, { Component } from 'react';
import { bake_cookie, read_cookie } from 'sfcookies';
import './login.css';
import moment from 'moment';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pseudo: '',
      email: '',
      password: '',
      id_user: '',
      cookies: { isLogin: read_cookie('isLogin'), user: read_cookie('user'), expire: read_cookie('expire') }
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    switch (event.target.id) {
      case "email":
        this.setState({ email: event.target.value });
        break;
      case "password":
        this.setState({ password: event.target.value });
        break;

      default:
        break;
    }
  }

  handleSubmit(event) {
    const that = this;
    fetch('/api/user/email/' + this.state.email + '/' + this.state.password)
      .then(res => res.json())
      .then(function (user) {
        switch (user.status) {
          case "success":
            that.setState({ email: user.data.email, password: user.data.password, pseudo: user.data.pseudo, id_user: user.data.id });
            that.props.login({ isLogin: true, user: { email: that.state.email, password: that.state.password, pseudo: that.state.pseudo, id_user: that.state.id_user }, tryToLogin: false });
            bake_cookie('user', user);
            bake_cookie('isLogin', true);
            bake_cookie('register',false);
            let d = new Date();
            d.setTime(d.getTime() + (20 * 60 * 1000));
            d = moment(d,"YYYY-MM-DD HH:mm");
            bake_cookie('expire', d);
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
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div class="window login">
          <div class="window-header">
            <h1 > Connexion </h1>
          </div>
          <div class="window-contain">
            <form onSubmit={this.handleSubmit}>
              <div class="form-group">
                <div class="form-field">
                  <label for="input-login">Email :</label>
                  <input id="email" type="text" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div class="form-field">
                  <label for="input-pwd">Password :</label>
                  <input id="password" type="text" value={this.state.password} onChange={this.handleChange} />
                </div>
                <button class="btn uppercase" type="submit">Se connecter</button>
              </div>
              <p class="account-help">Vous n'avez pas encore de compte ? <a class="underline red" >S'inscrire</a></p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;