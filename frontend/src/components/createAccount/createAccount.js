import React, { Component } from 'react';
import '../../main.css';
import moment from 'moment';
import { bake_cookie } from 'sfcookies';


class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pseudo: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.register({ isLogin: false, tryToLogin: true, user: {}, register: false });
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
      case "password-confirmation":
        this.setState({ passwordConfirmation: event.target.value });
        break;

      default:
        break;
    }
  }

  handleSubmit(event) {
    const that = this;
    if (this.state.password === this.state.passwordConfirmation)
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
      }).then(() => {
        fetch('/api/user/email/' + this.state.email + '/' + this.state.password)
          .then(res => res.json())
          .then(function (user) {
            switch (user.status) {
              case "success":
                that.props.register({ isLogin: true, user: { email: that.state.email, password: that.state.password, pseudo: that.state.pseudo, id_user: user.data.id_user }, tryToLogin: false, register: false });
                bake_cookie('user', user);
                bake_cookie('isLogin', true);
                bake_cookie('register', false);
                let d = new Date();
                d.setTime(d.getTime() + (20 * 60 * 1000));
                d = moment(d, "YYYY-MM-DD HH:mm");
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
      })
    else
      alert("les mots de passe ne correspondent pas")
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="window login">
          <div className="window-header">
            <h1 className="uppercase"> Inscription </h1>
          </div>
          <div className="window-contain">
            <div className="form-group">
              <form onSubmit={this.handleSubmit}>
                <div className="form-field">
                  <label htmlFor="email">Email :</label>
                  <input id="email" type="text" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="pseudo">Pseudo :</label>
                  <input id="pseudo" type="text" value={this.state.pseudo} onChange={this.handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="password">Password :</label>
                  <input id="password" type="password" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="password-confirmation">Confirmation :</label>
                  <input id="password-confirmation" type="password" value={this.state.passwordConfirmation} onChange={this.handleChange} />
                </div>
                <button type="submit" className="btn uppercase">S'inscrire</button>
              </form>
            </div>
            <p className="account-help">Vous avez déjà un compte ? <a onClick={this.handleClick} className="underline red" >Se connecter</a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccount;