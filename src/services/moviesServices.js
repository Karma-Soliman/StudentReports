import Movies from "../models/Movies.js"

export const getAllMovies = () => {
  return Movies.findAll()
}
  
export const getMovieById = (id) => {
    return Movies.findbyId(id)
}
  
export const createMovie = (movieData, userId) => {
    const { title } = movieData
      if (!title) {
        throw new Error("Title is required")
    }  
    return Movies.create({...movieData, user_id: userId})
}
    
export const updateMovie = (id, movieData, userId) => {
  const existingMovie = Movies.findbyId(id)
  if (!existingMovie) {
    return null
  }
  if (!Movie.isOwner(id, userId)) {
    throw new Error("You don't have permission to edit this movie")
  }
  
  return Movie.update(id, movieData)
}

export const deleteMovie = (id) => {
  if (!Movie.isOwner(id, userId)) {
    throw new Error("You don't have permission to delete this movie")
  }
  return Movies.delete(id)
}

export const getMovieCount = () => {
  return Movies.count()
}