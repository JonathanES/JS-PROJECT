import React, { Component } from 'react';

import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
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
            that.setState({ email: user.data.email, password: user.data.password, firstname: user.data.firstname, lastname: user.data.lastname });
            that.props.login(true);
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