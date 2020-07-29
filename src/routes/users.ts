/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
import { UsersModel } from '../models/users';

var usersModel = new UsersModel();

const router = (fastify, { }, next) => {
  var db: Knex = fastify.knex;

  fastify.post('/', async (req: fastify.Request, reply: fastify.Reply) => {
    const column = req.body.column;
    const value = req.body.value;

    const usersList: any = await usersModel.getUser(db, column, value);
    reply.send({
      rows: usersList,
    });
  })

  next();
}

module.exports = router;