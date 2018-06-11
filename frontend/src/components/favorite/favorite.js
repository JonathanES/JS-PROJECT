import React, { Component } from 'react';
import './favorite.css'

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            videos: props.videos,
            favorite: false
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
        if (prevState.videos !== this.state.videos || prevState.favorite !== this.state.favorite) {
            fetch('/api/favorite/' + this.state.videos + '/' + this.state.user.id_user)
                .then(res => res.json())
                .then(favorites => this.setState({ favorite: favorites.data }));
        }
    }
    componentDidMount() {
        fetch('/api/favorite/' + this.state.videos + '/' + this.state.user.id_user)
            .then(res => res.json())
            .then(favorites => this.setState({ favorite: favorites.data }));
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
                <button onClick={this.handleClick} class={this.state.favorite ? "btn-img btn-delete-favorite uppercase" : "btn-img btn-favorite uppercase"}>Ajouter aux favoris</button>
            </div>
        );
    }
}

export default Favorite;