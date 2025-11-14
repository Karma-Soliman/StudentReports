// Configuration
const API_URL = "https://studentreports-y3p1.onrender.com"
let token = localStorage.getItem("token")
let currentUser = null
let isLoginMode = true
let userFavorites = new Set()

// Initialize
if (token) {
  checkAuth()
}

// Auth Form Handling
document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const name = document.getElementById("name").value

  if (isLoginMode) {
    await login(email, password)
  } else {
    await register(name, email, password)
  }
})

document.getElementById("auth-switch-link").addEventListener("click", () => {
  isLoginMode = !isLoginMode
  if (isLoginMode) {
    document.getElementById("auth-title").textContent = "Login"
    document.getElementById("auth-btn-text").textContent = "Login"
    document.getElementById("auth-switch-text").textContent =
      "Don't have an account?"
    document.getElementById("auth-switch-link").textContent = "Register"
    document.getElementById("name-group").style.display = "none"
  } else {
    document.getElementById("auth-title").textContent = "Register"
    document.getElementById("auth-btn-text").textContent = "Register"
    document.getElementById("auth-switch-text").textContent =
      "Already have an account?"
    document.getElementById("auth-switch-link").textContent = "Login"
    document.getElementById("name-group").style.display = "block"
  }
})

// Auth Functions
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      token = data.token
      localStorage.setItem("token", token)
      currentUser = data.user
      showApp()
    } else {
      showMessage("auth-message", data.message || "Login failed", "error")
    }
  } catch (error) {
    showMessage("auth-message", "Error connecting to server", "error")
  }
}

async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      token = data.token
      localStorage.setItem("token", token)
      currentUser = data.user
      showApp()
    } else {
      showMessage(
        "auth-message",
        data.message || "Registration failed",
        "error"
      )
    }
  } catch (error) {
    showMessage("auth-message", "Error connecting to server", "error")
  }
}

async function checkAuth() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      currentUser = await response.json()
      showApp()
    } else {
      logout()
    }
  } catch (error) {
    logout()
  }
}

function logout() {
  token = null
  currentUser = null
  localStorage.removeItem("token")
  document.getElementById("auth-section").classList.remove("hidden")
  document.getElementById("app-section").classList.add("hidden")
}

function showApp() {
  document.getElementById("auth-section").classList.add("hidden")
  document.getElementById("app-section").classList.remove("hidden")
  document.getElementById(
    "user-name"
  ).textContent = `Hello, ${currentUser.name}!`
  loadMovies()
  loadFavorites()
}

// Tab Navigation
function showTab(tabName) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"))
  document
    .querySelectorAll(".content-section")
    .forEach((section) => section.classList.add("hidden"))

  event.target.classList.add("active")
  document.getElementById(`${tabName}-tab`).classList.remove("hidden")

  if (tabName === "movies") loadMovies()
  if (tabName === "favorites") loadFavorites()
}

// Movies Functions
async function loadMovies() {
  try {
    const response = await fetch(`${API_URL}/movies`)
    const movies = await response.json()

    const grid = document.getElementById("movies-grid")
    grid.innerHTML = ""

    if (movies.length === 0) {
      grid.innerHTML = '<p class="loading">No movies found. Add some!</p>'
      return
    }

    movies.forEach((movie) => {
      grid.innerHTML += createMovieCard(movie)
    })
  } catch (error) {
    document.getElementById("movies-grid").innerHTML =
      '<p class="error">Error loading movies</p>'
  }
}

async function loadFavorites() {
  try {
    const response = await fetch(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()

    userFavorites = new Set(data.favorites.map((f) => f.id))

    const grid = document.getElementById("favorites-grid")
    grid.innerHTML = ""

    if (data.favorites.length === 0) {
      grid.innerHTML =
        '<p class="loading">No favorites yet. Start adding some!</p>'
      return
    }

    data.favorites.forEach((movie) => {
      grid.innerHTML += createMovieCard(movie, true)
    })
  } catch (error) {
    document.getElementById("favorites-grid").innerHTML =
      '<p class="error">Error loading favorites</p>'
  }
}

function createMovieCard(movie, isFavoritesTab = false) {
  const isFavorited = userFavorites.has(movie.id)
  return `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director || "N/A"}</p>
            <p><strong>Year:</strong> ${movie.year || "N/A"}</p>
            <p><strong>Genre:</strong> ${movie.genre || "N/A"}</p>
            <div class="movie-actions">
                <button class="favorite-btn ${isFavorited ? "favorited" : ""}" 
                        onclick="toggleFavorite(${movie.id})">
                    ${isFavorited ? "⭐ Favorited" : "☆ Add to Favorites"}
                </button>
                <button class="btn btn-warning btn-small" onclick="openEditModal(${
                  movie.id
                })">
                        Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="openDeleteModal(${
                  movie.id
                }, '${movie.title.replace(/'/g, "\\'")}')">
                        Delete
                </button>
            </div>
        </div>
    `
}

async function toggleFavorite(movieId) {
  try {
    const isFavorited = userFavorites.has(movieId)

    if (isFavorited) {
      // Remove from favorites
      const response = await fetch(`${API_URL}/favorites/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        userFavorites.delete(movieId)
        showMessage("movies-message", "Removed from favorites", "success")
      }
    } else {
      // Add to favorites
      const response = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movieId }),
      })

      if (response.ok) {
        userFavorites.add(movieId)
        showMessage("movies-message", "Added to favorites!", "success")
      }
    }

    loadMovies()
    loadFavorites()
  } catch (error) {
    showMessage("movies-message", "Error updating favorites", "error")
  }
}

async function openEditModal(movieId) {
  try {
    const response = await fetch(`${API_URL}/movies/${movieId}`)
    const movie = await response.json()

    if (response.ok) {
      document.getElementById("edit-movie-id").value = movie.id
      document.getElementById("edit-title").value = movie.title
      document.getElementById("edit-director").value = movie.director || ""
      document.getElementById("edit-year").value = movie.year || ""
      document.getElementById("edit-genre").value = movie.genre || ""

      document.getElementById("edit-modal").classList.add("show")
    } else {
      showMessage("movies-message", "Error loading movie details", "error")
    }
  } catch (error) {
    showMessage("movies-message", "Error loading movie details", "error")
  }
}

function closeEditModal(event) {
  if (!event || event.target === document.getElementById("edit-modal")) {
    document.getElementById("edit-modal").classList.remove("show")
    document.getElementById("edit-message").innerHTML = ""
  }
}

document
  .getElementById("edit-movie-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault()

    const movieId = document.getElementById("edit-movie-id").value
    const movieData = {
      title: document.getElementById("edit-title").value,
      director: document.getElementById("edit-director").value,
      year: parseInt(document.getElementById("edit-year").value) || null,
      genre: document.getElementById("edit-genre").value,
    }

    try {
      const response = await fetch(`${API_URL}/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("edit-message", "Movie updated successfully!", "success")
        setTimeout(() => {
          closeEditModal()
          loadMovies()
          loadFavorites()
        }, 1500)
      } else {
        showMessage(
          "edit-message",
          data.message || "Failed to update movie",
          "error"
        )
      }
    } catch (error) {
      showMessage("edit-message", "Error connecting to server", "error")
    }
  })

// Delete Movie Functions
function openDeleteModal(movieId, movieTitle) {
  movieToDelete = movieId
  document.getElementById("delete-movie-title").textContent = movieTitle
  document.getElementById("delete-modal").classList.add("show")
}

function closeDeleteModal(event) {
  if (!event || event.target === document.getElementById("delete-modal")) {
    document.getElementById("delete-modal").classList.remove("show")
    movieToDelete = null
  }
}

async function confirmDelete() {
  if (!movieToDelete) return

  try {
    const response = await fetch(`${API_URL}/movies/${movieToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      showMessage("movies-message", "Movie deleted successfully", "success")
      closeDeleteModal()
      loadMovies()
      loadFavorites()
    } else {
      const data = await response.json()
      showMessage(
        "movies-message",
        data.message || "Failed to delete movie",
        "error"
      )
      closeDeleteModal()
    }
  } catch (error) {
    showMessage("movies-message", "Error connecting to server", "error")
    closeDeleteModal()
  }
}

// Add Movie Form
document
  .getElementById("add-movie-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault()

    const movieData = {
      title: document.getElementById("movie-title").value,
      director: document.getElementById("movie-director").value,
      year: parseInt(document.getElementById("movie-year").value) || null,
      genre: document.getElementById("movie-genre").value,
    }

    try {
      const response = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("add-movie-message", "Movie added successfully!", "success")
        document.getElementById("add-movie-form").reset()
        loadMovies()
      } else {
        showMessage(
          "add-movie-message",
          data.message || "Failed to add movie",
          "error"
        )
      }
    } catch (error) {
      showMessage("add-movie-message", "Error connecting to server", "error")
    }
  })

// Utility Functions
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId)
  element.innerHTML = `<div class="${type}">${message}</div>`
  setTimeout(() => {
    element.innerHTML = ""
  }, 3000)
}
