import db from "../config/database.js"

class User {
  //table schema
  static tableName = "users"
  //create table users
  static createTable() {
    const sql = `
            Create table if not exists users (
            id integer primary key autoincrement,
            name text not null,
            email text unique,
            password text,
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

  static findByEmail(email) {
    const stmt = db.prepare(`select * from ${this.tableName} where email = ?`)
    return stmt.get(email)
  }

  static create(userData) {
    const { name, email, password } = userData

    //creates user
    const stmt = db.prepare(
      `insert into ${this.tableName} (name, email, password) values (?, ?, ?)`
    )
    const result = stmt.run(name, email || null, password || null)

    return this.findbyId(result.lastInsertRowid)
  }

  static update(id, userData) {
    const { name, email } = userData
    const updates = []
    const values = []

    if (name !== undefined) {
      updates.push("name = ?")
      values.push(name)
    }
    if (email !== undefined) {
      updates.push("email = ?")
      values.push(email)
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

    static emailExist(email, excludeId = null) {
        let stmt
        //check if email exists already
        if (excludeId) {
            stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ? and id = ?`)
            return stmt.get(email, excludeId) !== undefined
        } else {
            stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ?`)
            return stmt.get(email) !== undefined
        }
    }

    static count() {
        const stmt = db.prepare(`select count(*) as count from ${this.tableName}`)
        return stmt.get().count
    }

    static seed() {
        const count = this.count()
        if (count === 0) {
            console.log("adding sample data...")
            const sampleUsers = [
                { name: "Alice", email: "alice@example.com" },
                { name: "Bob", email: "bob@example.com" },
                { name: "Charlie", email: "charlie@example.com" },
                { name: "Dave", email: "dave@example.com" },
            ]
            sampleUsers.forEach(user => this.create(user))

            console.log(`${sampleUsers.length} sample data(s) added!`)
        }
    }
}

export default User
