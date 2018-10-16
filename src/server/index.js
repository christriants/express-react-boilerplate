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
const API_SECRET = 'ceiaTwtT5vpR3NYQYtaekfpDNNPZuvv2';
const clientId = 8471;
const timestamp = (new Date()).getTime();
const apiToken = generateToken('readonly', timestamp);
const offlineClip = `https://livestreamapis.com/v3/accounts/27551527/events/8416517/videos/181920584.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`;

// Setup our routes
app.get('/live', (request, response) => {
  let responseData;
  getLivestreamStatus(apiToken)
    .then((data) => {
      const parsedData = JSON.parse(data);
      const { isLive } = parsedData;
      const stream = isLive ? `https://livestreamapis.com/v3/accounts/27551527/events/8416517/master.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}` : offlineClip;
      responseData = {
        liveStatus: isLive,
        stream,
      };
      return responseData;
    })
    .then((responseData) => {
      getOfflineTitle(apiToken)
        .then((data) => {
          const parsedData = JSON.parse(data);
          const { caption } = parsedData;
          responseData.title = caption;
          response.json(responseData);
          // console.log(responseData)
        });
    });
});

// app.get('/vod', (request, response) => {
//   getOfflineTitle(apiToken)
//     .then((data) => {
//       const parsedData = JSON.parse(data);
//       const { caption } = parsedData;
//       response.json({
//         title: caption,
//       });
//     });
// });

// Calls livestream API to get .m3u8
function getLiveStreamClip(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const livestream = `https://livestreamapis.com/v3/accounts/27551527/events/8416517/master.m3u8?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`;
  // console.log(livestream);
  return fetch(livestream, getReq);
}

getLiveStreamClip()

// Calls livestream API to get event status
function getLivestreamStatus(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const livestreamEvent = `https://livestreamapis.com/v3/accounts/27551527/events/8416517?clientId=${clientId}&token=${livestreamToken}&timestamp=${timestamp}`;
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

// get offline video title

function getOfflineTitle(livestreamToken) {
  const getReq = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const offlineVid = `https://livestreamapis.com/v3/accounts/27551527/events/8416517/videos/169465950?clientId=${clientId}&token=${apiToken}&timestamp=${timestamp}`;
  return fetch(offlineVid, getReq)
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
