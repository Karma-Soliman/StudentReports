import express from "express"

const app = express()

const PORT = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        first: "john",
        last: "doe"
    })
})

app.listen(PORT, () => {
    console.log(`ServerPort is running http://localhost:${PORT}`)
})