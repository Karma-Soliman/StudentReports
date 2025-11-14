import express from "express"
import cors from "cors"  //for the diff ports
import config from "./config/config.js"
import { logMiddleware } from "./middleware/middleware.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"
import userRoutes from "./routes/userRoutes.js"
import moviesRoutes from "./routes/moviesRoutes.js"
import favoriteRoutes from "./routes/favoriteRoutes.js"
import { initializeDatabase } from "./config/database.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()

await initializeDatabase()
app.use(cors())
app.use(express.json())

//app.use("/users", userRoutes) // not used anymor but check 
app.use(express.urlencoded({extended: true}))

app.use(logMiddleware)

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API!",
    version: "1.0.0",
    environment: config.nodeEnv,
    endpoints: {
      users: "/users",
      register: '/auth/register',
      login: '/auth/login',
      me: '/auth/me',
      movies: "/movies",
      favorites: "/favorites"
    }
  })
})

// health check (for render)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  })
})

//protected routes 

//1:
app.use('/auth', authRoutes)
app.use('/users', validateApiKey, userRoutes)
app.use('/movies', moviesRoutes)
app.use("/favorites", favoriteRoutes)

// or 2 (easier for development)
//app.use('/users, validateApiKeyProduction, userRoutes)

//404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found', 
    message: `Route ${req.method} ${req.path} not found`
  })
})

//error
app.use((err, req, res, next) => {
  console.error('Error: ', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error', 
    ...(config.isDevelopment() && { stack: err.stack})
  })
})

app.listen(config.port, () => {
  console.log(`ServerPort is running http://localhost:${config.port}`)
  console.log(`Environment: ${config.nodeEnv}`)
  console.log(
    `API Key protection: ${config.apiKey ? "ENABLED" : "DISABLED"}`
  )
  console.log(`\nAPI Documentation:`)
  console.log(`📊 Database ready`)
  console.log(`  GET    /              - Welcome message (public)`)
  console.log(`  GET    /health        - Health check (public)`)
  console.log("---Authentication--")
  console.log(`  POST   /auth/register - Register new user (public)`)
  console.log(`  POST   /auth/login    - Login user (public)`)
  console.log(`  GET    /auth/me       - Get current user (requires token)`)
  console.log("---Users--")
  console.log(`  GET    /users      - Get all users (protected)`)
  console.log(`  GET    /users/:id  - Get user by ID (protected)`)
  console.log(`  POST   /users      - Create new user (protected)`)
  console.log(`  PUT    /users/:id  - Update user (protected)`)
  console.log(`  DELETE /users/:id  - Delete user (protected)`)
  console.log("---Movies--")
  console.log(`  GET    /movies      - Get all movies (public)`)
  console.log(`  GET    /movies/:id  - Get movie by ID (public)`)
  console.log(`  POST   /movies      - Create new movie (public)`)
  console.log(`  PUT    /movies/:id  - Update movie (protected)`)
  console.log(`  DELETE /movies/:id  - Delete movie (protected)`)
  console.log("---Favorites--")
  console.log(`  GET    /favorites      - Get all favorites for token user (protected)`)
  console.log(`  GET    /favorites/:movie_id  - Get favorite by ID (protected)`)
  console.log(`  POST   /favorites      - Add a favorite (protected)`)
  console.log(`  DELETE /favorites/:movie_id  - Remove Favorite (protected)`)

})

export default app