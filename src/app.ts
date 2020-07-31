/// <reference path="../typings.d.ts" />

import path = require('path');
import * as HttpStatus from 'http-status-codes';
import * as fastify from 'fastify';

require('dotenv').config({ path: path.join(__dirname, '../config') });

import { Server, IncomingMessage, ServerResponse } from 'http';

import helmet = require('fastify-helmet');

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    level: 'error'
  },
  bodyLimit: 5 * 1048576
});

app.register(require('fastify-formbody'));
app.register(require('fastify-cors'), {});
app.register(require('fastify-no-icon'));
app.register(
  helmet,
  { hidePoweredBy: { setTo: 'PHP 5.2.0' } }
);

app.register(require('fastify-rate-limit'), {
  max: +process.env.MAX_CONNECTION_PER_MINUTE || 1000,
  timeWindow: '1 minute'
});

app.register(require('fastify-static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/html',
});

app.register(require('fastify-jwt'), {
  secret: process.env.SECRET_KEY
});

app.decorate("authenticate", async (request, reply) => {
  let token: string = null;

  if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
    token = request.headers.authorization.split(' ')[1];
  } else {
    token = request.body.token;
  }

  try {
    const decoded = await request.jwtVerify(token);
  } catch (err) {
    reply.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
    })
  }
});

// connection =========================================
app.register(require('./plugins/db'), {
  connection: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      schema: process.env.DB_SCHEMA,
      charSet: process.env.DB_CHARSET,
      encrypt: process.env.DB_ENCRYPT || true
    }
  },
  connectionName: 'db'
});

app.register(require('./routes/index'), { prefix: '/', logger: true });
app.register(require('./routes/users'), { prefix: '/users', logger: true });

const port = +process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) throw err;
  console.log(app.server.address());
});
