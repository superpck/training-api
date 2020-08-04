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
      .limit(100);

  }

  saveUser(db: Knex, data: any = {}) {
    const uid = +data.uid || 0;
    delete data.uid;
    if (uid > 0) {
      return db('users')
        .update(data)
        .where({ uid });
    } else {
      return db('users')
        .insert(data);
    }
  }

  deleteUser(db: Knex, uid: number) {
    return db('users')
      .del()
      .where({ uid });
  }

  login(db: Knex, username: string, password: string) {
    return db('users')
      .where({ username, password })
      .limit(1);
  }

}
