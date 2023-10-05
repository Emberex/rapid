const { randomUUID } = require('node:crypto');

module.exports = () => ({
  socketIO: true,
  webserver: {
    port: 'auto',
  },
  database: {
    dropWhenFinished: true,
    connection: {
      database: 'rapid_test_' + randomUUID().replace(/-/g, '_'),
    },
  },
});
