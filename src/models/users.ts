import * as Knex from 'knex';

export class UsersModel {

  getUser(db: Knex, columnSearch = null, searchValue = null) {
    let where: any = {};
    if (columnSearch && searchValue) {
      where[columnSearch] = searchValue;
    }

    return db('users')
      .where(where)
      .orderBy('fname')
      .orderBy('lname')
      .limit(5);

  }

}
