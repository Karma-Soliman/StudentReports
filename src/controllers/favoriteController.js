import * as favoritesServices from "../services/favoritesServices.js"

export const getFavorites = (req, res) => {
    try {
        const userId = req.user.id //from token
        const favorites = favoritesServices.getUserFavorite(userId)

        res.status(200).json({count: favorites.length, favorites})
    } catch (error) {
        if (error.message === "User not found") {
          return res.status(404).json({ message: error.message })
        }
        res.status(500).json({message: error.message})
    }
}

export const addFavorites = (req, res) => {
  try {
      const userId = req.user.id //from token
      const { movie_id } = req.body
      
      if (!movie_id) {
        return res.status(400).json({ message: "Movie is required" })
      }
    const favorites = favoritesServices.addFavorite(userId, movie_id)

    res.status(200).json({ count: favorites.length, favorites })
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Movie not found") {
      return res.status(404).json({ message: error.message })
    }
    if (error.message === "Movie already in favorites") {
      return res.status(409).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}

export const removeFavorites = (req, res) => {
  try {
      const userId = req.user.id //from token
      const { movie_id } = req.params
    const result = favoritesServices.removeFavorite(userId, movie_id)

    res.status(200).json(result)
  } catch (error) {
    if (error.message === "Favorite not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}

export const checkFavorites = (req, res) => {
  try {
    const userId = req.user.id //from token
    const { movie_id } = req.params
    const isFav = favoritesServices.checkFavorite(userId, movie_id)

    res.status(200).json({is_favorite: isFav})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
