const main = require('./jeevesMain');
const http = require('http');

const port = main.port;

const requestHandler = (request, response) => {
  response.end('Hello world');
};

const server = http.createServer(requestHandler);


module.exports = {
  execute() {
    server.listen(port, (err) => {
      if (err) {
        return console.log(`Error: ${err}`);
      }

      console.log(`Web server listening on ${port}`);
    });
  },
};

// TODO serve realtime log
