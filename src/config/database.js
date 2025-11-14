import Database from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"
import config from "./config.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath

if (path.isAbsolute(config.databaseUrl)) {
  //absolute path (production)
  dbPath = config.databaseUrl
} else {
  // relative path (development)
  dbPath = path.join(__dirname, "../../", config.databaseUrl)
}

console.log(`Database path ${dbPath}`)

const db = new Database(dbPath)

db.pragma("foreign_keys = ON")

export const initializeDatabase = async () => {
  console.log("Database initializing")

  //import models
  const User = (await import("../models/User.js")).default
  User.createTable()
  if (config.isDevelopment()) {
    User.seed()
  }

  const Movies = (await import("../models/Movies.js")).default
  Movies.createTable()
  if (config.isDevelopment()) {
    Movies.seed()
  }

  const Favorites = (await import("../models/Favorites.js")).default
  Favorites.createTable()

  console.log("database initialized!")
}

export default db
