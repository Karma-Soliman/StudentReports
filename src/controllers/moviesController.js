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
        const movieData= req.body
        const newMovie = moviesServices.createMovie(movieData)

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
        const updatedMovie = moviesServices.updateMovie(id, movieData) 

        if (!updatedMovie) {
            return res.status(404).json({message: "Movie not found!"})
        }

        res.status(200).json(updatedMovie)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteMovie = (req, res) => {
    try {
        const { id } = req.params
        const deleted = moviesServices.deleteMovie(id)
        
        if (!deleted) {
            return res.status(404).json({message: "Movie not found"})
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message: error.messsage})
    }
}