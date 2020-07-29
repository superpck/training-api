/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
import { UsersModel } from '../models/users';

var usersModel = new UsersModel();

const router = (fastify, { }, next) => {
  var db: Knex = fastify.knex;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    const usersList: any = await usersModel.getUser(db);
    reply.send({
      rows: usersList,
    });
  })

  next();
}

module.exports = router;