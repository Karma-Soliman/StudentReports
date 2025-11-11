import express from "express"
import { logMiddleware } from "../middleware/middleware.js"
import * as auth from "../controllers/authController.js"

const router = express.Router()

// this pat willbe added when we mount this router to index.js

router.get("/", logMiddleware, auth.getAllUsers)
router.get("/:id", logMiddleware, auth.getUserById)
router.post("/", auth.createUser)
router.put("/:id", auth.updateUser)
router.delete("/:id", auth.deleteUser)

export default router