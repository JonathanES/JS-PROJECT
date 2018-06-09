import React, { Component } from 'react';
import './account.css'

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            favorite: false,
            favorites: [],
            history: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleClick(id, event) {
        const that = this;
        switch (id) {
            case "delete":
                fetch('/api/history/user/' + this.state.user.id_user, {
                    method: 'DELETE'
                }).then(() => { that.setState({ history: [] }) });
                break;
            default:
                this.props.videos({ currentVideos: event.id_videos, search: false, account: false });
                break;
        }
    }

    handleDelete(id, event) {
        const that = this;
        fetch('/api/favorite/' + event.id_videos + '/' + this.state.user.id_user, {
            method: 'DELETE'
        });
        fetch('/api/favorite/' + this.state.user.id_user)
        .then(res => res.json())
        .then(favorites => this.setState({ favorites: favorites.data }));
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user === state.user && props.videos === state.videos)
            return null;
        return {
            user: props.user,
            videos: props.videos
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.favorites !== this.state.favorites) {
            fetch('/api/favorite/' + this.state.user.id_user)
                .then(res => res.json())
                .then(favorites => this.setState({ favorites: favorites.data }));
        }
        if (prevState.history !== this.state.history) {
            fetch('/api/history/user/' + this.state.user.id_user)
                .then(res => res.json())
                .then(history => this.setState({ history: history.data }));
        }
    }
    componentDidMount() {
        fetch('/api/favorite/' + this.state.user.id_user)
            .then(res => res.json())
            .then(favorites => this.setState({ favorites: favorites.data }));

        fetch('/api/history/user/' + this.state.user.id_user)
            .then(res => res.json())
            .then(history => this.setState({ history: history.data }));
    }

    render() {
        return (
            <div>
                <h3> Mes vidéos favorites (<span class="red">{this.state.favorites.length}</span>)</h3>
                <hr />
                <div class="myvideo">
                    {this.state.favorites.map(favorite =>
                        <div class="myvideo-elt">
                            <a class="my-yt-thumbnail" href="#">
                                <img id={favorite.id_videos} src={favorite.thumbnail} alt={favorite.id_videos} onClick={() => this.handleClick("", favorite)} />
                            </a>
                            <div class="infos">
                                <p class="title"> {favorite.name} </p>
                                <p class="time"> 13:32 </p>
                            </div>
                            <button class="btn-img btn-delete-favorite uppercase" id={favorite.id_videos} onClick={() => this.handleDelete("", favorite)}> Retirer des favoris</button>
                        </div>
                    )}
                </div>
                <h3 class="history-title"> Mon historique </h3>
                <button class="btn-delete-history" onClick={(e) => this.handleClick("delete", e)} id="delete"> Supprimer l'historique</button>
                <hr />
                <div class="history">
                    {this.state.history.map(history =>
                        <div class="myvideo-elt">
                            <a class="my-yt-thumbnail" href="#">
                                <img src={history.thumbnail} alt={history.id_videos} onClick={() => this.handleClick("", history)} />
                            </a>
                            <div class="infos">
                                <p class="title"> {history.name}</p>
                                <p class="time"> 13:32 </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Account;