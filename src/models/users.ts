import * as Knex from 'knex';

export class UsersModel {
  getUser(db: Knex) {
    return db('users').select('uid', 'username', 'fname');
  }
}
