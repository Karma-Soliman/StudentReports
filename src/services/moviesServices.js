import Movies from "../models/Movies.js"

export const getAllMovies = () => {
  return Movies.findAll()
}
  
export const getMovieById = (id) => {
    return Movies.findbyId(id)
}
  
export const createMovie = (movieData) => {
    const { title } = movieData
      if (!title) {
        throw new Error("Title is required")
    }  
    return Movies.create(movieData)
}
    
export const updateMovie = (id, movieData) => {
  const existingMovie = Movies.findbyId(id)
  if (!existingMovie) {
    return null
  }
  return Movies.update(id, movieData)
}

export const deleteMovie = (id) => {
  return Movies.delete(id)
}

export const getMovieCount = () => {
  return Movies.count()
}