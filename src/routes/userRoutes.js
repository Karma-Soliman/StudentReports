import express from "express"
import { logMiddleware } from "../middleware/middleware.js"
import * as user from "../controllers/userController.js"

const router = express.Router()

// this pat willbe added when we mount this router to index.js

router.get("/", logMiddleware, user.getAllUsers)
router.get("/:id", logMiddleware, user.getUserById)
router.post("/", user.createUser)
router.put("/:id", user.updateUser)
router.delete("/:id", user.deleteUser)

export default router