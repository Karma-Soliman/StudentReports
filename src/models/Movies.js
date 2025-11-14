import db from "../config/database.js"

class Movies {
  //table schema
  static tableName = "movies"
  //create table movies
  static createTable() {
    const sql = `
            Create table if not exists movies (
            id integer primary key autoincrement,
            title text not null,
            director text,
            year integer,
            genre text,
            created_at datetime default current_timestamp,
            updated_at datetime default current_timestamp
            )`
    db.exec(sql)

    console.log(`Table '${this.tableName}' created/verified`)
  }

  static findAll() {
    const stmt = db.prepare(`select * from ${this.tableName} ORDER BY id`)
    return stmt.all()
  }

  static findbyId(id) {
    const stmt = db.prepare(`select * from ${this.tableName} where id = ?`)
    return stmt.get(id)
  }
  static create(movieData) {
    const { title, director, year, genre } = movieData

    //creates movie
    const stmt = db.prepare(
      `insert into ${this.tableName} (title, director, year, genre) values (?, ?, ?, ?)`
    )
    const result = stmt.run(
      title,
      director || null,
      year || null,
      genre || null
    )

    return this.findbyId(result.lastInsertRowid)
  }

  static update(id, movieData) {
    const { title, director, year, genre } = movieData
    const updates = []
    const values = []

    if (title !== undefined) {
      updates.push("title = ?")
      values.push(title)
    }
    if (director !== undefined) {
      updates.push("director = ?")
      values.push(director)
    }
    if (year !== undefined) {
      updates.push("year = ?")
      values.push(year)
    }
    if (genre !== undefined) {
      updates.push("genre = ?")
      values.push(genre)
    }
    updates.push("updated_at = CURRENT_TIMESTAMP")
    if (updates.length === 1) {
      //updated timestamp only
      return this.findbyId(id)
    }
    values.push(id)

    const stmt = db.prepare(
      `update ${this.tableName} set ${updates.join(", ")} where id = ?`
    )
    stmt.run(...values)
    return this.findbyId(id)
  }
  static delete(id) {
    const stmt = db.prepare(`delete from ${this.tableName} where id = ?`)
    const result = stmt.run(id)
    // returns true if deleted.
    return result.changes > 0
  }
  static count() {
    const stmt = db.prepare(`select count(*) as count from ${this.tableName}`)
    return stmt.get().count
  }

  static seed() {
    const count = this.count()
    if (count === 0) {
      console.log("adding sample data...")
      const sampleMovies = [
        {
          title: "The Shawshank Redemption",
          director: "Frank Darabont",
          year: 1994,
          genre: "Drama",
        },
        {
          title: "The Godfather",
          director: "Francis Ford Coppola",
          year: 1972,
          genre: "Crime",
        },
        {
          title: "The Dark Knight",
          director: "Christopher Nolan",
          year: 2008,
          genre: "Action",
        },
        {
          title: "Pulp Fiction",
          director: "Quentin Tarantino",
          year: 1994,
          genre: "Crime",
        },
      ]
      sampleMovies.forEach((movie) => this.create(movie))

      console.log(`${sampleMovies.length} sample data(s) added!`)
    }
  }
}
export default Movies
