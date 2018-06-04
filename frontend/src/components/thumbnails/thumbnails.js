import React, { Component } from 'react';
import Videos from '../videos/videos';
import './thumbnails.css';
import Comment from '../comment/comment';

class Thumbnails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            thumbnails: [],
            value: "",
            search: true,
            currentVideos: "",
            user: props.user
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    handleClick(event){
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
        this.setState({currentVideos: event.id});
        this.setState({search: false});
    }

    render() {
        return (
            <div>
                <h2>Thumbnails</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.thumbnails.map(thumbnail =>
                    <div key={thumbnail.id}> <img id={thumbnail.id} src={thumbnail.url} style={{ height: 90, width: 120 }} alt={thumbnail.id} onClick={() => this.handleClick(thumbnail)}/> {thumbnail.titles}</div>
                )}
                {this.state.search === false && <Videos id={this.state.currentVideos} user={this.state.user}/>}
                {this.state.search === false &&<Comment user={this.state.user} videos={this.state.currentVideos}/>}
            </div>
        );
    }
}

export default Thumbnails;