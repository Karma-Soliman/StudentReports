import * as userServices from "../services/userServices.js" 
    

export const getAllUsers = (req, res) => {
    try {
        const users = userServices.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getUserById = (req, res) => {
    try {
        const { id } = req.params
        const user = userServices.getUserById(id) 

        if (!user) {
            return res.status(404).json({message: "User not found!"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const createUser = (req, res) => {
    try {
        const { name, email } = req.body
        if (!name) {
            return res.status(400).json({ message: "Name is required" })
        }
        const newUser = userServices.createUser({ name, email })
        res.status(201).json(newUser)
    } catch (error) {
        if (error.message === "Email already exists") {
            return res.status(409).json({ message: error.message })
        }
        res.status(500).json({ message: error.message })
    }
}

export const updateUser = (req, res) => {
    try {
        const { id } = req.params
        const {name, email} = req.body
        const updatedUser = userServices.updateUser(id, {name, email}) 

        if (!updatedUser) {
            return res.status(404).json({message: "User not found!"})
        }
        res.status(200).json(updatedUser)
    } catch (error) {
        if (error.message === "Email already exists") {
          return res.status(409).json({ message: error.message })
        }
        res.status(500).json({message: error.message})
    }
}

export const deleteUser = (req, res) => {
    try {
        const { id } = req.params
        const deleted = userServices.deleteUser(id)
        
        if (!deleted) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message: error.messsage})
    }
}