// this file is related to tokens
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import * as userServices from "../services/userServices.js"

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )
}

// endpoints

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      })
    }

    // for developing in the future not necessary now
    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //if (!emailRegex.test(email)) {
    //  return res.status(400).json({
    //    message: "Invalid email format",
    //  })
    //}

    if (password.length < 5) {
      return res.status(400).json({
        message: "Passwaore should be longer than 5 characters.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const newUser = userServices.createUser({
      name,
      email,
      password: hashedPassword,
    })

    const token = generateToken(newUser)

    const { password: _, ...userWithoutPass } = newUser

    res.status(201).json({
      message: "Successful!",
      user: userWithoutPass,
      token,
    })
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    const user = userServices.getUserByEmail(email)

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user)

    const { password: _, ...userWithoutPass } = user

    res.status(201).json({
      message: "Successful!",
      user: userWithoutPass,
      token,
    })
  } catch (error) {
    return res.status(500).json({ message: "error.message" })
  }
}

export const getCurrentUser = (req, res) => {
  try {
    const user = userServices.getUserById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Remove password from response
    const { password: _, ...userWithoutPass } = user

    res.status(200).json(userWithoutPass)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
