import express from "express"
import { logMiddleware } from "./middleware/middleware.js"

const app = express()

const PORT = 3000

app.use(express.json())

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Dave" },
]



app.get("/", logMiddleware, (req, res) => {
  res.json({users, data: req.body })
})

app.post("/", (req, res) => {
  console.log(req)
}) 

app.listen(PORT, () => {
  console.log(`ServerPort is running http://localhost:${PORT}`)
})
