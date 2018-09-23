const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// Initialize our server
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, './../../')));
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Values for the Livestream API
const API_SECRET = 'HTuRddLgDjCZcnJdo0kvpYY9HOX9RCFA';
const clientId = 8143;
const timestamp = (new Date()).getTime();
const apiToken = generateToken('readonly', timestamp);
const offlineClip = 'surf.mp4';

// Setup our routes
app.get('/live', (request, response) => {
  getLivestreamStatus(apiToken)
    .then((data) => {
      const parsedData = JSON.parse(data);
      const { isLive } = parsedData;
      const stream = isLive ? `https://livestreamapis.com/v3/accounts/12963240/events/5037587/master.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}` : offlineClip;
      // console.log(`https://livestreamapis.com/v3/accounts/12963240/events/5037587/master.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`)
      response.json({
        liveStatus: isLive,
        stream,
      });
    });
});

// Calls livestream API to get .m3u8
function getLiveStreamClip(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const livestream = `https://livestreamapis.com/v3/accounts/12963240/events/5037587/master.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`;
  // console.log(livestream);
  return fetch(livestream, getReq);
}

// Calls livestream API to get event status
function getLivestreamStatus(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const livestreamEvent = `https://livestreamapis.com/v3/accounts/12963240/events/5037587?clientId=${clientId}&token=${livestreamToken}&timestamp=${timestamp}`;
  return fetch(livestreamEvent, getReq)
    .then((data) => {
      return data.text();
    })
    .then((textResponse) => {
      return textResponse;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Helpers
function generateToken(scope) {
  const hmac = crypto.createHmac('md5', API_SECRET);
  const tokenString = `${API_SECRET}:${scope}:${timestamp}`;
  hmac.update(tokenString);
  const crypted = hmac.digest('hex');
  return crypted;
}
