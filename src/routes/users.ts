/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { UsersModel } from '../models/users';

const crypto = require('crypto');

var usersModel = new UsersModel();

const router = (fastify, { }, next) => {
  var db: Knex = fastify.db;

  fastify.post('/', { preHandler: [ fastify.authenticate ] }, async (request: fastify.Request, reply: fastify.Reply) => {
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
        if (rows.length > 0) {
          const row = rows[0];
          const payload = {
            fullname: row.prename + row.fname + ' ' + row.lname,
            uid: row.uid,
            email: row.email, tel_office: row.tel_office,
            tel_mobile: row.tel_mobile
          };

          const token = fastify.jwt.sign(payload, { expiresIn: '8h' });

          reply.send({
            statusCode: HttpStatus.OK,
            token
          });

        } else {
          reply.send({
            statusCode: HttpStatus.BAD_REQUEST, message: 'Incorrect username or password'
          });
        }
      } catch (error) {
        reply.send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message
        });
      }

    } else {
      reply.send({
        statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid username or password'
      });
    }
  })

  fastify.post('/save', { preHandler: [ fastify.authenticate ] }, async (request: fastify.Request, reply: fastify.Reply) => {
    const data = request.body.data;

    if (data) {
      try {
        if (data.password) {
          data.password = crypto.createHash('sha256').update(data.password).digest('hex');
        }
        const result: any = await usersModel.saveUser(db, data);
        reply.send({
          statusCode: HttpStatus.OK,
          result
        });
      } catch (error) {
        reply.send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message
        });
      }
    } else {
      reply.send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid parameter'
      });
    }

  })

  fastify.delete('/delete/:uid', { preHandler: [ fastify.authenticate ] }, async (request: fastify.Request, reply: fastify.Reply) => {
    const uid = request.params.uid || 0;
    try {
      const result: any = await usersModel.deleteUser(db, uid);
      reply.send({
        statusCode: HttpStatus.OK,
        result
      });
    } catch (error) {
      reply.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  })

  next();
}

module.exports = router;