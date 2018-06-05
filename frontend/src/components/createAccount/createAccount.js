import React, { Component } from 'react';

import './createAccount.css';

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
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Pseudo:
          <input id="pseudo" type="text" value={this.state.pseudo} onChange={this.handleChange} />
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

export default CreateAccount;