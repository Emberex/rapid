const { v4: uuidv4 } = require('uuid');

module.exports = () => ({
  socketIO: true,
  webserver: {
    port: 'auto',
  },
  database: {
    dropWhenFinished: true,
    connection: {
      database: 'rapid_test_' + uuidv4().replace(/-/g, '_'),
    },
  },
});
