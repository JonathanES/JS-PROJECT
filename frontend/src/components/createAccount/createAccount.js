import React, { Component } from 'react';
import Login from '../login/login'
import './createAccount.css';
import moment from 'moment';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';


class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pseudo: '',
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    switch (event.target.id) {
      case "pseudo":
        this.setState({ pseudo: event.target.value });
        break;
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
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pseudo: this.state.pseudo,
        email: this.state.email,
        password: this.state.password
      })
    })
    fetch('/api/user/email/' + this.state.email + '/' + this.state.password)
      .then(res => res.json())
      .then(function (user) {
        switch (user.status) {
          case "success":
            that.props.register({ isLogin: true, user: { email: that.state.email, password: that.state.password, pseudo: that.state.pseudo, id_user: user.data.id }, tryToLogin: false, register: false });
            bake_cookie('user', user);
            bake_cookie('isLogin', true);
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
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div class="window login">
          <div class="window-header">
            <h1 class="uppercase"> Inscription </h1>
          </div>
          <div class="window-contain">
            <div class="form-group">
              <form onSubmit={this.handleSubmit}>
                <div class="form-field">
                  <label for="input-login">Email :</label>
                  <input id="email" type="text" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div class="form-field">
                  <label for="input-login">Pseudo :</label>
                  <input id="pseudo" type="text" value={this.state.pseudo} onChange={this.handleChange} />
                </div>
                <div class="form-field">
                  <label for="input-pwd">Password :</label>
                  <input id="password" type="text" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div class="form-field">
                  <label for="input-pwd">Confirmation :</label>
                  <input id="password" type="text" value={this.state.password} onChange={this.handleChange} />
                </div>
                <button type="submit" class="btn uppercase">S'inscrire</button>
              </form>
            </div>
            <p class="account-help">Vous avez déjà un compte ? <a class="underline red" href="#">Se connecter</a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccount;