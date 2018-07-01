
module.exports = rapid => {
  const Configurable = require('./Configurable');

  return class Webserver extends Configurable {
    get defaultConfig() {
      return {
        port: 9090,
        jwt: {}
      };
    }

    constructor() {
      super(...arguments);
      if(!this.config.jwt.secret) {
        this.config.jwt.secret = this._loadSecret();
      }
    }

    _loadSecret() {
      if(!this._secret) {
        const readOrCreateFile = require('./utils/readOrCreateFile');
        const secretFilePath = rapid.localPath('.jwtsecret');
        this._secret = readOrCreateFile.sync(secretFilePath, require('uuid/v4'));
      }
      return this._secret;
    }

    async _errorMiddleware(context, next) {
      try {
        await next();
      } catch (error) {
        context.status = error.status || 500;

        // Avoid leaking data through uncaught errors in production.
        if(rapid.env === 'production' && context.status === 500) {
          context.body = {error: {message: 'Internal server error.'}};
        } else {
          context.body = {error};
        }
      }
    }

    async _loggingMiddleware(context, next) {
      await next();
      const { method, url } = context.request;
      const { status, message } = context.response;
      rapid.log(`${status} ${method} ${url} - ${message}`);
    }

    async start() {
      const Koa = require('koa');
      const bodyParser = require('koa-bodyparser');
      const koaApp = this.koaApp = new Koa();

      koaApp.use(this._loggingMiddleware.bind(this));
      koaApp.use(this._errorMiddleware.bind(this));
      koaApp.use(bodyParser());
    }

    async stop() {
      if(this._server) {
        return new Promise((resolve, reject) => {
          this._server.close(error => error ? reject(error) : resolve());
        });
        rapid.log(`Server disconnected`);
      }
    }

    async listen() {
      this._server = this.koaApp.listen(this.config.port);
      rapid.log(`Listening on port ${this.config.port}`);
    }
  };
};
