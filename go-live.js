const ffmpeg = require('fluent-ffmpeg');
const stream = ffmpeg('stream.mp4');

function goLive(rtmpKey) {
  return new Promise(((resolve, reject) => {
    stream
      .on('start', function () {
        console.log('Attempting to stream...please start the player')
      })
      .videoCodec('libx264')
      .audioCodec('aac')
      .addOption('-f', 'flv')
      .size('1920x1080')
      .on('error', reject)
      .on('end', resolve)
      .save(`rtmp://rtmpin.livestreamingest.com/rtmpin/${rtmpKey}`)
      .on('end', function () {
        console.log('Stream has ended')
      });
  }));
}

goLive('p76-6rx-vjb-9mz?p=0');
