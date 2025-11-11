// this is the databse switch later with MongoDB or Postgres

//let users = [
//  { id: 1, name: "Alice" },
//  { id: 2, name: "Bob" },
//  { id: 3, name: "Charlie" },
//  { id: 4, name: "Dave" },
//]

import db from "../config/database.js"


export const getAllUsers = () => {
  const stmt = db.prepare("select * from users ORDER BY id")
  return stmt.all()
}


export const getUserById = (id) => {
  const stmt = db.prepare("select * from users where id = ?")
  return stmt.get(id)
}

export const createUser = (userData) => {
  const { name, email } = userData

  //check if email exists already
  if (email) {
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
    if (existing) {
      throw new Error("Email already exists")
    }
  }
  //creates user
  const stmt = db.prepare("insert into users (name, email) values (?, ?)")
  const result = stmt.run(name, email || null)

  return getUserById(result.lastInsertRowid)
}

export const updateUser = (id, userData) => {
    const { name, email } = userData
    const user = getUserById(id)
    //user exists?
    if (!user) {
        return null
    }
    //check if email exists already
    if (email && email !== user.email) {
        const existing = db.prepare("select id from users where id != ? and email = ?").get(email, id)
        if (existing) {
            throw new Error('Email already exists')
        }
    }
    //updates
    const stmt = db.prepare('update users set name = ?, email = ? where id = ?')
    stmt.run(name || user.name, email || user.email, id)
    return getUserById(id)
}

export const deleteUser = (id) => {
    const stmt = db.prepare('delete from users where id = ?')
    const result = stmt.run(id)
    // returns true if deleted.
    return result.changes > 0
}
