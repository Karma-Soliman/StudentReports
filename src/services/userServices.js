// this is the databse switch later with MongoDB or Postgres

//let users = [
//  { id: 1, name: "Alice" },
//  { id: 2, name: "Bob" },
//  { id: 3, name: "Charlie" },
//  { id: 4, name: "Dave" },
//]

//import db from "../config/database.js"

import User from "../models/User.js"

export const getAllUsers = () => {
  return User.findAll()
}

export const getUserById = (id) => {
  return User.findbyId(id)
}

export const createUser = (userData) => {
  const { name, email } = userData

  //check if email exists already
  if (email && User.emailExist(email)) {
    throw new Error("Email already exists")
  }
  // Additional business logic could go here
  // e.g., send welcome email, log user creation, etc.
  // DO THIS!^^
  //creates user

  return User.create({ name, email })
}

export const updateUser = (id, userData) => {
  const { name, email } = userData

  const existingUser = User.findbyId(id)
  if (!existingUser) {
    return null
  }
  //check if email exists already
  if (email && email !== existingUser.email && User.emailExists(email, id)) {
    throw new Error("Email already exists")
  }

  return User.update(id, { name, email})
}

export const deleteUser = (id) => {
  return User.delete(id)
}

export const getUserByEmail = (email) => {
  return User.findByEmail(email)
}

export const getUserCount = () => {
  return User.count()
}