# My React App 

This is a simple React app that contains a player, and switches content for Live and offline.

Please use Safari, with CORS restrictions turned off for full experience.

## Development Setup

```
git clone git@github.com:christriants/React-App-Final-Project.git
cd React-App-Final-Project
npm install
npm start
```

Express server will be started at `http://localhost:3000/`

## To start front end app:

```
npm run webpack
```

## Stream

Add a video file into the React-App-Final-Project directory. 
Require that file as the 'stream' variable in the go-live.js file.

```
node go-live.js
```

Check the player, and it should now be streaming your local file.

## What happens?

Your file is being streamed to a RTMP server directed to an event on livestream.com.

Using their public API, this app will determine whether or not the Livestream event is live.

If the event is live, the video player source will switch to the Livestream HLS file, unlocked using three auth parameters.

If the event is not live, the video player source will match a local file in the directory.

## Future goals

I want to implement Firebase for thumbs up/thumbs down, depending on a particular stream.

Add the ability to upload videos. 

Allow for switching videos via API.
