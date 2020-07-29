/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log(db);
    reply.send({
      method: 'GET',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      date2: moment().locale('th').format('lll'),
    });
  })

  fastify.post('/', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log(db);
    reply.send({
      method: 'post',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      date2: moment().locale('th').format('lll'),
    });
  })

  fastify.get('/sign-token', async (req: Request, reply: fastify.Reply) => {
    const token = fastify.jwt.sign(
      { 
        name: 'test ระบบ',
        username: 'myID'
      }, 
      { expiresIn: '8h' }
      );
    reply.send({ 
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      token: token 
    });
  })

  

  next();

}

module.exports = router;