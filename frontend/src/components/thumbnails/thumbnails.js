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
            thumbnails: props.thumbnails,
            value: props.searchValue,
            search: true,
            currentVideos: "",
            user: props.user,
            guest: props.guest,
            isLogin: props.login
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user === state.user && props.login === state.isLogin && props.guest === state.guest && props.thumbnails === state.thumbnails && props.searchValue === state.value)
            return null;
        return {
            user: props.user,
            isLogin: props.login,
            guest: props.guest,
            thumbnails: props.thumbnails,
            value: props.searchValue
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleClick(event) {
        fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: event.id,
                name: event.titles,
                thumbnail: event.url

            })
        })
            .then(() => {
                this.setState({ currentVideos: event.id });
                this.setState({ search: false });

            })
            .then(() => {
                this.props.videos({ currentVideos: this.state.currentVideos, search: this.state.search });
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
                    iduser: this.state.user.id_user,
                    thumbnail: event.url
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
                    iduser: this.state.guest.id_user,
                    thumbnail: event.url
                })
            })
    }

    render() {
        return (
            <div>
                <h3 class="center result-search">Résultat de votre recherche "<span class="red">{this.state.value}</span>"</h3>
                <div class="search-container">
                    {this.state.thumbnails.map(thumbnail =>
                        <a key={thumbnail.id} class="yt-thumbnail" href="#">
                            <img id={thumbnail.id} src={thumbnail.url} alt={thumbnail.id} onClick={() => this.handleClick(thumbnail)} />
                            <p> {thumbnail.titles}</p>
                        </a>
                    )}

                </div>
            </div>
        );
    }
}

export default Thumbnails;