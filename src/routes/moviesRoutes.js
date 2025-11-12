import express from "express"
import { logMiddleware } from "../middleware/middleware.js"
import { verifyToken } from "../middleware/authen.js"
import * as movies from "../controllers/moviesController.js"


const router = express.Router()



// this part willbe added when we mount this router to index.js

router.get("/", logMiddleware, movies.getAllMovies)
router.get("/:id", logMiddleware, movies.getMovieById)
router.post("/", movies.createMovie)

// protected only authenticated users can modify
router.put("/:id", verifyToken, movies.updateMovie)
router.delete("/:id", verifyToken, movies.deleteMovie)

export default router