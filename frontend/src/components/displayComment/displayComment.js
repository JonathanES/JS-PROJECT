import React, { Component } from 'react';

class DisplayComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      videos: props.videos,
      comments: []
    };
  }

  componentDidMount(){
      const update = () =>{
        fetch('/api/comment/' + this.state.videos)
        .then(res => res.json())
        .then(comments => this.setState({ comments: comments.data }, () => console.log('Customers fetched...', comments)));
      }
      update();
  }

  render() {
    return (
      <div>       
        <h2>Comment</h2>
        {this.state.comments.map(comment => <div><div> {comment.firstname} {comment.lastname} </div> <div>{comment.datepost} </div> <div> {comment.comment}  </div> </div> )} 
      </div>
    );
  }
}

export default DisplayComment;