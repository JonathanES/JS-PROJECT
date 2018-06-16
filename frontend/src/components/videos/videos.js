import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Views from '../views/views';
import '../../main.css';


class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      guest: props.guest,
      videos: props.id,
      isLogin: props.login,
      thumbnail: props.thumbnail,
      user_view: 0,
      views: 0
    };
    this._onStateChange = this._onStateChange.bind(this);
    this.updateViews = this.updateViews.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user === state.user && props.id === state.videos && props.login === state.isLogin && props.guest === state.guest)
      return null;
    return {
      user: props.user,
      videos: props.id,
      isLogin: props.login,
      guest: props.guest
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.videos !== this.state.videos) {
      if (this.state.isLogin) {
        fetch('/api/history/' + this.state.user.id_user + '/' + this.state.videos)
          .then(res => res.json())
          .then(userviews => {
            if (userviews.status !== 'failure')
              this.setState({ user_view: parseInt(userviews.data.count, 10) })
          });
      }
      fetch('/api/history/views/' + this.state.videos)
        .then(res => res.json())
        .then(views => {
          if (views.status !== 'failure')
            this.setState({ views: parseInt(views.data.count, 10) })
        });
    }
  }
  componentDidMount() {
    if (this.state.isLogin) {
      fetch('/api/history/' + this.state.user.id_user + '/' + this.state.videos)
        .then(res => res.json())
        .then(userviews => {
          if (userviews.status !== 'failure')
            this.setState({ user_view: parseInt(userviews.data.count, 10) })
        });
    }
    fetch('/api/history/views/' + this.state.videos)
      .then(res => res.json())
      .then(views => {
        if (views.status !== 'failure')
          this.setState({ views: parseInt(views.data.count, 10) })
      });
  }

  updateViews() {
    if (this.state.isLogin) {
      fetch('/api/history/' + this.state.user.id_user + '/' + this.state.videos)
        .then(res => res.json())
        .then(userviews => {
          if (userviews.status !== 'failure')
            this.setState({ user_view: parseInt(userviews.data.count, 10) })
        });
    }
    fetch('/api/history/views/' + this.state.videos)
      .then(res => res.json())
      .then(views => {
        if (views.status !== 'failure')
          this.setState({ views: parseInt(views.data.count, 10) })
      });
  }

  _onStateChange(event) {
    if (event.data === 0) {
      event.target.playVideo();
      event.data = 1;
      if (this.state.isLogin)
        fetch('/api/history', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.props.id,
            iduser: this.props.user.id_user,
            thumbnail: this.props.thumbnail
          })
        }).then(() => {
          this.componentDidMount();
        });
      else
        fetch('/api/history', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.props.id,
            iduser: this.props.guest.id_user,
            thumbnail: this.props.thumbnail
          })
        }).then(() => {
          this.componentDidMount();
        });
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
        <div className="yt-player">
          <YouTube
            videoId={this.props.id}
            opts={opts}
            onReady={this._onReady}
            onStateChange={this._onStateChange}
          />
          <Views login={this.state.isLogin} userviews={this.state.user_view} views={this.state.views} />

        </div>
      </div>
    );
  }

}

export default Videos;