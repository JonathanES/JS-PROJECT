import React, { Component } from 'react';
import '../../main.css';

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
  static getDerivedStateFromProps(props, state) {
    if (props.user === state.user && props.videos === state.videos)
      return null;
    return {
      user: props.user,
      videos: props.videos
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.videos !== this.state.videos) {
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
    }).then(() => {
      this.componentDidMount();
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div class="comments-space">
          <h3>Commentaires (<span class="red">{this.state.comments.length}</span>)</h3>
          {this.state.comments.map(comment =>
            <div class="comment">
              <div class="comment-header">
                <p class="author"> {comment.pseudo} </p>
                <p class="date"> {comment.datepost} </p>
              </div>
              <div class="comment-content">
                <p>{comment.comment}</p>
              </div>
            </div>
          )}
          <div class="post-comment">
            <form onSubmit={this.handleSubmit} id="usrform">
              <label for="ta-comment">Vous pouvez poster un commentaire !</label>
              <textarea value={this.state.comment} onChange={this.handleChange} id="ta-comment" rows="5" />
              <button type="submit" class="btn btn-send uppercase">Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;