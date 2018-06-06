import React, { Component } from 'react';
import { bake_cookie, read_cookie } from 'sfcookies';
import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pseudo: '',
      email: '',
      password: '',
      id_user: '',
      cookies: { isLogin: read_cookie('isLogin'), user: read_cookie('user') }
    };
    if (Object.keys(this.state.cookies).length > 0)
      this.props.login({ isLogin: this.state.cookies.isLogin, user: this.state.cookies.user.data });
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
            that.props.login({ isLogin: true, user: { email: that.state.email, password: that.state.password, pseudo: that.state.pseudo, id_user: that.state.id_user } });
            bake_cookie('user', user);
            bake_cookie('isLogin', true);
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
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
          <input id="email" type="text" value={this.state.email} onChange={this.handleChange} />
            Password:
          <input id="password" type="text" value={this.state.password} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Login;