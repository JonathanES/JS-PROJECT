import React, { Component } from 'react';
import './thumbnails.css';

class Thumbnails extends Component {
    constructor() {
        super();
        this.state = {
            customers: [],
            thumbnails: [],
            value: ""
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
        alert('a picture was clicked on' + event.id);
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
                    <div key={thumbnail.id}> <img id={thumbnail.id} src={thumbnail.url} style={{ height: 90, width: 120 }} alt={thumbnail.id} onClick={this.handleClick.bind(this,thumbnail)}/> {thumbnail.titles}</div>
                )}
            </div>
        );
    }
}

export default Thumbnails;