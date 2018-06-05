import React, { Component } from 'react';

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            videos: props.videos,
            favorite: 0
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
            fetch('/api/favorite/' + this.state.videos)
                .then(res => res.json())
                .then(favorites => this.setState({ favorite: favorites.data.count }));
        }
    }
    componentDidMount() {
        const update = () => {
            fetch('/api/favorite/' + this.state.videos)
                .then(res => res.json())
                .then(favorites => this.setState({ favorite: favorites.data.count }));
        }
        update();
    }

    handleClick(event) {
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
            this.componentDidMount();
        })
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>
                    Add favorite
                </button>
                {this.state.favorite}
            </div>
        );
    }
}

export default Favorite;