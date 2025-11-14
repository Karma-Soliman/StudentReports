import * as moviesServices from "../services/moviesServices.js"

export const getAllMovies = (req, res) => {
    try {
        const movies = moviesServices.getAllMovies()

        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getMovieById = (req, res) => {
    try {
        const { id } = req.params
        const movie = moviesServices.getMovieById(id) 

        if (!movie) {
            return res.status(404).json({message: "Movie not found!"})
        }
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const createMovie = (req, res) => {
    try {
        const movieData = req.body
        const userId = req.user.id
        const newMovie = moviesServices.createMovie(movieData, userId)

        res.status(201).json(newMovie)
    } catch (error) {
        if (error.message === "Title is required") {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: error.message })
    }
}

export const updateMovie = (req, res) => {
    try {
        const { id } = req.params
        const movieData = req.body
        const userId = req.user.id
        const updatedMovie = moviesServices.updateMovie(id, movieData, userId) 

        if (!updatedMovie) {
            return res.status(404).json({message: "Movie not found!"})
        }

        res.status(200).json(updatedMovie)
    } catch (error) {
        if (error.message === "You don't have permission to edit this movie") {
          return res.status(403).json({ message: error.message })
        }
        res.status(500).json({message: error.message})
    }
}

export const deleteMovie = (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const deleted = moviesServices.deleteMovie(id, userId)
        
        if (!deleted) {
            return res.status(404).json({message: "Movie not found"})
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message: error.messsage})
    }
}