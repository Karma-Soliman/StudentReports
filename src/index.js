import express from "express"
import { logMiddleware } from "./middleware/middleware.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()

const PORT = 3000


app.use(express.json())

app.use("/users", userRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API!",
    endpoints: {
      users: "/users"
    }
  })
})

app.listen(PORT, () => {
  console.log(`ServerPort is running http://localhost:${PORT}`)
  console.log(`API Documentation:`)
  console.log(`  GET    /users      - Get all users`)
  console.log(`  GET    /users/:id  - Get user by ID`)
  console.log(`  POST   /users      - Create new user`)
  console.log(`  PUT    /users/:id  - Update user`)
  console.log(`  DELETE /users/:id  - Delete user`)
})
