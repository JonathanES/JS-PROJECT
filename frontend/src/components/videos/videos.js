import React, { Component } from 'react';
import './videos.css';
import YouTube from 'react-youtube';
 
class Videos extends Component {

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  _onStateChange(event){
      console.log(event.data);
      if (event.data === 0){
          event.target.playVideo();
          event.data = 1;
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
      <YouTube
        videoId={this.props.id}
        opts={opts}
        onReady={this._onReady}
        onStateChange={this._onStateChange}
      />
    );
  }
 
}

export default Videos;