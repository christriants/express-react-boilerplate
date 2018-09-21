const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');

// Initialize our server
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, './../../')));
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Values for the Livestream API
const API_SECRET = 'HTuRddLgDjCZcnJdo0kvpYY9HOX9RCFA';
const clientId = 8143;
const timestamp = (new Date()).getTime();
const apiToken = generateToken('readonly', timestamp);

// Setup our routes
app.get('/live', (request, response) => {
  const isLive = getLivestream(apiToken);
  const liveResponse = {
    liveStatus: isLive,
  };
  // getLivestream()
  //   .then(data => {

  //   })
  //   .catch(error => {
  //     response.json({ error: 'We hit an error from livestream api'});
  //   });
  // const liveResponse = { value: 'hey chris' };
  response.json(liveResponse);
});

// Calls livestream API to get event status
async function getLivestream(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const livestreamEvent = `https://livestreamapis.com/v3/accounts/12963240/events/5037587?clientId=${clientId}&token=${livestreamToken}&timestamp=${timestamp}`;
  const res = await fetch(livestreamEvent, getReq);
  console.log(res.json());
  const json = res.json();
  const { isLive } = json;
  // console.log(isLive);
  return isLive;
}

// Calls livestream API
// const source = async function changeVideo() {
//   const isEventLive = await getLivestream();
//   if (isEventLive === true) {
//     // window.document.getElementById('video').src = livestream;
//     const livestream = `https://livestreamapis.com/v3/accounts/12963240/events/5037587/live.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`;
//     console.log(livestream);
//   } else {
//     // document.getElementById('video').src = '';
//     console.log('guitar-solo.mp4');
//   }
// };

// source();

// Helpers
function generateToken(scope) {
  const hmac = crypto.createHmac('md5', API_SECRET);
  const tokenString = `${API_SECRET}:${scope}:${timestamp}`;
  hmac.update(tokenString);
  const crypted = hmac.digest('hex');
  return crypted;
}
