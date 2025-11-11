import express from "express"
import config from "./config/config.js"
import { logMiddleware } from "./middleware/middleware.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"
import userRoutes from "./routes/userRoutes.js"
import { initializeDatabase } from "./config/database.js"

const app = express()

await initializeDatabase()

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
      users: "/users"
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
app.use('/users', validateApiKey, userRoutes)

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
    ...app(config.isDevelopment() && { stack: err.stack})
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
  console.log(`  GET    /users      - Get all users`)
  console.log(`  GET    /users/:id  - Get user by ID`)
  console.log(`  POST   /users      - Create new user`)
  console.log(`  PUT    /users/:id  - Update user`)
  console.log(`  DELETE /users/:id  - Delete user`)
})

export default app
