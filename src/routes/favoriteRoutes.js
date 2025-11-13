import express from "express"
import { verifyToken } from "../middleware/authen.js"
import * as favorite from "../controllers/favoriteController.js"

const router = express.Router()
//all require authenitcation
router.use(verifyToken)

// this pat willbe added when we mount this router to index.js

router.get("/", favorite.getFavorites)
router.post("/", favorite.addFavorites)
router.delete("/:movie_id", favorite.removeFavorites)
router.get("/:movie_id", favorite.checkFavorites)

export default router