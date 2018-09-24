/* eslint-disable */
import React, { Component } from 'react';
import styles from '../scss/application.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      liveStatus: false,
      stream: null,
      title: 'Checking live status...'
    };
  }

  componentWillMount() {
    fetch('/live')
      .then(data => {
        return data.json();
      })
      .then(response => {
        this.setState({
          liveStatus: response.liveStatus,
          stream: response.stream,
          title: `You are watching the following archived VOD: ${response.title}`,
        });
      });
  }

  render() {

    const { liveStatus, stream, title } = this.state;

    const pageTitle = liveStatus ?  'We are live!': title
    console.log(liveStatus, pageTitle)

    return (
      <main className="App" >
        <h1>{pageTitle}</h1>
        <video id="player" className="video-js" controls preload="auto" poster="livestream.jpg" data-setup="{}" loop>
          <source id='video' src={stream} type='video/mp4' />
          <p className="vjs-no-js">
            <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </video>
      </main>
      
    );
  }
}

export default App;
