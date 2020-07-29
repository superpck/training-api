import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import * as Knex from 'knex'

declare module 'fastify' {
  interface FastifyRequest<HttpRequest> {
    user: any;
  }
  interface FastifyReply<HttpResponse> { }
  interface Request extends FastifyRequest<IncomingMessage> { }
  interface Reply extends FastifyReply<ServerResponse> { }
  interface FastifyInstance {
    Knex: Knex;
    db: Knex;
    dbHDC: Knex;
  }
}

