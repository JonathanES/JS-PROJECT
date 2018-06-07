import React, { Component } from 'react';
import Videos from '../videos/videos';
import './thumbnails.css';
import Comment from '../comment/comment';
import Favorite from '../favorite/favorite';

class Thumbnails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            thumbnails: [],
            value: "",
            search: true,
            currentVideos: "",
            user: props.user,
            guest: props.guest,
            isLogin: props.login
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user === state.user && props.login === state.isLogin && props.guest === state.guest)
            return null;
        return {
            user: props.user,
            isLogin: props.login,
            guest: props.guest
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        fetch('/api/repeat/' + this.state.value)
            .then(res => res.json())
            .then(thumbnails => this.setState({ thumbnails }, () => console.log('Customers fetched...', thumbnails)));
        event.preventDefault();
    }

    handleClick(event) {
        alert('a picture was clicked on' + event);
        fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: event.id,
                name: event.titles
            })
        });
        if (this.state.isLogin)
            fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: event.id,
                    iduser: this.state.user.id_user
                })
            })
        else
            fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: event.id,
                    iduser: this.state.guest.id_user
                })
            })
        this.setState({ currentVideos: event.id });
        this.setState({ search: false });
    }

    render() {
        return (
            <div>
                <h2>Thumbnails</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Rechercher une vidéo" />
                        <button type="submit"  id="search-button"></button>
                    </label>
                </form>
                {this.state.thumbnails.map(thumbnail =>
                    <div key={thumbnail.id}> <img id={thumbnail.id} src={thumbnail.url} style={{ height: 90, width: 120 }} alt={thumbnail.id} onClick={() => this.handleClick(thumbnail)} /> {thumbnail.titles}</div>
                )}
                {this.state.search === false && <Videos login={this.state.isLogin} id={this.state.currentVideos} user={this.state.user} guest={this.state.guest} />}
                {this.state.search === false && this.state.isLogin === true && <Favorite videos={this.state.currentVideos} user={this.state.user} />}
                {this.state.search === false && this.state.isLogin === true && <Comment user={this.state.user} videos={this.state.currentVideos} />}
            </div>
        );
    }
}

export default Thumbnails;