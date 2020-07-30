/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
import { UsersModel } from '../models/users';

const crypto = require('crypto');

var usersModel = new UsersModel();

const router = (fastify, { }, next) => {
  var db: Knex = fastify.db;

  fastify.post('/', async (request: fastify.Request, reply: fastify.Reply) => {
    const column = request.body.column;
    const value = request.body.value;

    const usersList: any = await usersModel.getUser(db, column, value);
    reply.send({
      rows: usersList,
    });
  })

  fastify.post('/login', async (request: fastify.Request, reply: fastify.Reply) => {
    const username = request.body.username;
    const password = request.body.password;

    if (username && password) {
      try {
        const passwd = crypto.createHash('sha256').update(password).digest('hex');
        const rows: any = await usersModel.login(db, username, passwd);
        if (rows.length) {
          const row = rows[0];
          const payload = {
            fullname: row.prename + row.fname + ' ' + row.lname,
            uid: row.uid,
            email: row.email, tel_office: row.tel_office,
            tel_mobile: row.tel_mobile
          };

          const token = fastify.jwt.sign(payload, { expiresIn: '8h' });

          reply.send({
            statusCode: 200,
            token
          });

        } else {
          reply.send({
            statusCode: 400, message: 'Incorrect username or password'
          });
        }
      } catch (error) {
        reply.send({
          statusCode: 500, message: error.message
        });
      }

    } else {
      reply.send({
        statusCode: 400, message: 'Invalid username or password'
      });
    }
  })

  next();
}

module.exports = router;