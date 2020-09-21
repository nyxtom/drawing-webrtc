# Realtime Collaborative Drawing with WebRTC + Canvas

![Realtime Collaborative Drawing Demo](https://nyxtom.dev/assets/v0m78s45eb4xuyubkm2m.gif)

This is the code for my series on [realtime collaborative drawing](https://nyxtom.dev/2020/09/05/collaborative-drawing-webrtc-canvas/). The code is outlined in the blog posts. The dependencies are straightforward and mostly for the express server to run the signaling server. All the client-side javascript is vanilla javascript and requires no bundling or external dependencies.

## Installation

To setup the express server you'll need to have [redis](https://redis.io/) installed in order to have the signal messages routed to each other properly (should you want to run multiple processes). This is outlined in my blog post about using [Redis PubSub](https://nyxtom.dev/2020/09/15/redis-pubsub-drawing/). Once you have redis installed, you can run the `npm install .` in the directory. Finally, run `node .` to start the server and open up a browser to create a drawing session.

## Contributing

If you are interested in contributing to this project in any way, please feel free to open up a pull request and I wll be sure to take a look (and possibly a follow-up blog post). Thanks!

## LICENCE

Licensed under the MIT license.
