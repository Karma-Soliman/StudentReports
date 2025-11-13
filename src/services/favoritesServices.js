import Movies from "../models/Movies.js"
import User from "../models/User.js"
import Favorites from "../models/Favorites.js"

export const getUserFavorite = (userId) => {
  const user = User.findbyId(userId)
  if (!user) {
    throw new Error("User not found")
  }
  return Favorites.findByUserId(userId)
}

export const addFavorite = (userId, movieId) => {
  const user = User.findbyId(userId)
  if (!user) {
    throw new Error("User not found")
  }
  const movie = Movies.findbyId(movieId)
  if (!movie) {
    throw new Error("Movie not found")
  }
  if (Favorites.exists(userId, movieId)) {
    throw new Error("Movie already in favorites")
  }
  Favorites.create(userId, movieId)

  return {
    message: "Movie added to favorites",
    movie,
  }
}

export const removeFavorite = (userId, movieId) => {
    // check in favorites
    if (!Favorites.exists(userId, movieId)) {
        throw new Error("Favorite not found")
    }

  const deleted = Favorites.delete(userId, movieId)
  if (!deleted) {
    throw new Error("Failed to remove favorite")
  }
    
    return {
        message: "Movie removed from favorites"
    }
}

export const checkFavorite = (userId, movieId) => {
  return Favorites.exists(userId, movieId)
}

export const getFavoriteCount = (movieId) => {
  return Favorites.countByMovie(movieId)
}