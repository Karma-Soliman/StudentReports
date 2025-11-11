import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Database(path.join(__dirname, '../../database.sqlite'))

db.pragma = ('foreign_keys = ON')

export const initializeDatabase = ()=> {
    const createUsersTable = `
    Create table if not exists users (
    id integer primary key autoincrement,
    name text not null,
    email text unique,
    created_at datetime default current_timestamp
    )`
    db.exec(createUsersTable)

    console.log("Database initialized")
    
    // first use practice
    const userCount = db.prepare('select count(*) from users').get()

    if (userCount.count === 0) {
        console.log('adding sample data...')
        const insert = db.prepare('insert into user (name, email) values (?, ?)')
        insert.run('Alice', 'alice@ex.com')
        insert.run("Bob", "bob@ex.com")
        insert.run("Charlie", "charlie@ex.com")
        insert.run("Dave", "dave@ex.com")

        console.log('sample data added!')
    }
}

export default db