import React, { Component } from 'react';
import '../../main.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thumbnails: [],
            value: "",
            search: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        const that = this;
        fetch('/api/repeat/' + this.state.value)
            .then(res => res.json())
            .then(thumbnails => this.setState({ thumbnails }, () => that.props.thumbnails({ thumbnails: thumbnails, searchValue: this.state.value, currentVideos: "",account: false })));
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input id="search-bar" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Rechercher une vidéo" />
                <button type="submit" id="search-button"></button>
            </form>
        );
    }
}
export default Search;