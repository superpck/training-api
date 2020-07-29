import * as Knex from 'knex';

export class UsersModel {

  getUser(db: Knex, columnSearch = null, searchValue = null) {
    let where: any = {};
    if (columnSearch && searchValue){
      where[columnSearch] = searchValue;
    }
    return db('users')
      .select('uid', 'username', 'fname')
      .where(where);
  }

}
