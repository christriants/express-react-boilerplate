const ffmpeg = require('fluent-ffmpeg')
const stream = ffmpeg('./guitar-solo.mp4')

function goLive(rtmpKey) {
  return new Promise(function (resolve, reject) {
    stream
      .on('start', function () {
        console.log('Attempting to stream...')
      })
      .videoCodec('libx264')
      .audioCodec('aac')
      .addOption('-f', 'flv')
      .size('1920x1080')
      .on('error', reject)
      .on('end', resolve)
      .save(`rtmp://rtmpin.livestreamingest.com/rtmpin/${rtmpKey}`)
  })

};

goLive('zmj-dxn-ajy-6g9?p=0')
