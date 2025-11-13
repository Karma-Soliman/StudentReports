import db from "../config/database.js"

class Favorites {
  //table schema
  static tableName = "favorites"
  //create table movies
  static createTable() {
    const sql = `
            Create table if not exists favorites (
            id integer primary key autoincrement,
            user_id integer not null,
            movie_id integer not null,
            created_at datetime default current_timestamp,
            foreign key (user_id) references users(id) on delete cascade,
            foreign key (movie_id) references movies(id) on delete cascade,
            unique (user_id, movie_id)
            )`
    db.exec(sql)

    console.log(`Table '${this.tableName}' created/verified`)
  }

  static findByUserId(userId) {
    const stmt = db.prepare(`select uf.id as favorite_id,
            uf.created_at as favorited_at, m.* from ${this.tableName} uf 
            join movies m on uf.movie_id = m.id
            where uf.user_id = ?
            order by uf.created_at desc`)
    return stmt.all(userId)
  }

  static exists(userId, movieId) {
    const stmt = db.prepare(`select id from ${this.tableName}
            where user_id = ? and movie_id = ?`)
    return stmt.get(userId, movieId) !== undefined
  }

  static create(userId, movieId) {
    //add favorite
    const stmt = db.prepare(
      `insert into ${this.tableName} (user_id, movie_id) values (?, ?)`
    )
    const result = stmt.run(userId, movieId)
    return result.lastInsertRowid
  }

  static delete(userId, movieId) {
    const stmt = db.prepare(
      `delete from ${this.tableName} where user_id = ? and movie_id = ?`
    )
    const result = stmt.run(userId, movieId)
    // returns true if deleted.
    return result.changes > 0
  }
  static countByMovie(movieId) {
    const stmt = db.prepare(`select count(*) as count from ${this.tableName}
        where movie_id = ?`)
    return stmt.get(movieId).count
  }
  static countByUser(userId) {
    const stmt = db.prepare(`select count(*) as count from ${this.tableName}
      where user_id = ?`)
    return stmt.get(userId).count
  }
}

export default Favorites