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
        if (prevState.favorite !== this.state.favorite) {
            fetch('/api/favorite/' + this.state.user.id_user)
                .then(res => res.json())
                .then(favorites => this.setState({ favorite: favorites.data }));
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

    handleClick(event) {
        const that = this;
        if (!this.state.favorite)
            fetch('/api/favorite', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    iduser: this.state.user.id_user,
                    url: this.state.videos
                })
            }).then(() => {
                that.setState({ favorite: true });
            })
        else
            fetch('/api/favorite/' + this.state.videos + '/' + this.state.user.id_user, {
                method: 'DELETE'
            })
                .then(() => {
                    that.setState({ favorite: false });
                })

        event.preventDefault();
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
                                <img src={favorite.thumbnail} />
                            </a>
                            <div class="infos">
                                <p class="title"> {favorite.name} </p>
                                <p class="time"> 13:32 </p>
                            </div>
                            <button class="btn-img btn-delete-favorite uppercase"> Retirer des favoris</button>
                        </div>
                    )}
                </div>
                <h3 class="history-title"> Mon historique </h3>
                <button class="btn-delete-history"> Supprimer l'historique</button>
                <hr />
                <div class="history">
                    {this.state.history.map(history =>
                        <div class="myvideo-elt">
                            <a class="my-yt-thumbnail" href="#">
                                <img src={history.thumbnail} />
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