import React, { Component } from 'react';
import './videos.css';
import YouTube from 'react-youtube';

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      videos: props.id,
      user_view: 0,
      views: 0
    };
    this._onStateChange = this._onStateChange.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.user === state.user && props.id === state.videos)
      return null;
    return {
      user: props.user,
      videos: props.id
    }
  }

 componentDidUpdate(prevProps, prevState){
    if (prevState.videos !== this.state.videos){
      fetch('/api/history/' + this.state.user.id_user + '/' + this.state.videos)
        .then(res => res.json())
        .then(userviews => this.setState({ user_view: userviews.data.count }, () => console.log('Customers fetched...', userviews)));

      fetch('/api/history/views/' + this.state.videos)
        .then(res => res.json())
        .then(views => this.setState({ views: views.data.count }, () => console.log('Customers fetched...', views)));
    } 
 } 
  componentDidMount() {
    fetch('/api/history/' + this.state.user.id_user + '/' + this.state.videos)
    .then(res => res.json())
    .then(userviews => this.setState({ user_view: userviews.data.count }, () => console.log('Customers fetched...', userviews)));

  fetch('/api/history/views/' + this.state.videos)
    .then(res => res.json())
    .then(views => this.setState({ views: views.data.count }, () => console.log('Customers fetched...', views)));
  }


  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  _onStateChange(event) {
    const that = this;
    if (event.data === 0) {
      event.target.playVideo();
      event.data = 1;
      fetch('/api/history', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: this.props.id,
          iduser: this.props.user.id_user
        })
      });
      this.componentDidMount();
    }
  }
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <div>
        <YouTube
          videoId={this.props.id}
          opts={opts}
          onReady={this._onReady}
          onStateChange={this._onStateChange}
        />
        User views: {this.state.user_view}
        All views: {this.state.views}
        <div></div>
      </div>
    );
  }

}

export default Videos;