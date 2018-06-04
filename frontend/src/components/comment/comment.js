import React, { Component } from 'react';

import './comment.css';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      videos: props.videos,
      comment: "",
      comments: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static getDerivedStateFromProps(props, state){
    if (props.user === state.user && props.videos === state.videos)
      return null;
    return {
      user: props.user,
      videos: props.videos
    }    
  }

 componentDidUpdate(prevProps, prevState){
    if (prevState.videos !== this.state.videos){
      fetch('/api/comment/' + this.state.videos)
      .then(res => res.json())
      .then(comments => this.setState({ comments: comments.data }, () => console.log('Customers fetched...', comments)));
    } 
 } 
  componentDidMount() {
    fetch('/api/comment/' + this.state.videos)
      .then(res => res.json())
      .then(comments => this.setState({ comments: comments.data }, () => console.log('Customers fetched...', comments)));
  }

  handleChange(event) {
    this.setState({ comment: event.target.value });
  }

  handleSubmit(event) {
    fetch('/api/comment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iduser: this.state.user.id_user,
        url: this.state.videos,
        comment: this.state.comment
      })
    });
    event.preventDefault();
    this.componentDidMount();
  }

  render() {
    return (
      <div>
        <h2>Comment</h2>
        {this.state.comments.map(comment => <div><div> {comment.firstname} {comment.lastname} </div> <div>{comment.datepost} </div> <div> {comment.comment}  </div> </div>)}
        <form onSubmit={this.handleSubmit} id="usrform">
          <textarea value={this.state.comment} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Comment;