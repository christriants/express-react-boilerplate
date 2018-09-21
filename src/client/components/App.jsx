/* eslint-disable */
import React, { Component } from 'react';
import styles from '../scss/application.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      liveStatus: false,
    };
  }

  componentWillMount() {
    fetch('/live')
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data.liveStatus);
        this.setState({
          liveStatus : data.liveStatus
        })
      });
  }

  render() {
    const { liveStatus } = this.state;
    const videoSrc = liveStatus ? '' : 'guitar-solo.mp4';

    return (
      <main className="App" >
        <h1>Chris' RTMP Player</h1>
        <video id="player" className="video-js" controls preload="auto" poster="livestream.jpg" data-setup="{}">
          <source id='video' src={videoSrc} type='video/mp4' />
          <p className="vjs-no-js">
            <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </video>
      </main>
    );


  }

}

export default App;
