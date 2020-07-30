/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
import { UsersModel } from '../models/users';

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

  next();
}

module.exports = router;