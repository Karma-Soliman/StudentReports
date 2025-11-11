import config from "../config/config.js"

// middleware to validate api key

export const validateApiKey = (req, res, next) => {
  //extract api key from headers
  const apiKey =
    req.headers["x-api-key"] ||
      req.headers["authorization"]?.replace("Bearer ", "")
    
    // check
    if (!apiKey) {
        return res.status(401).json({error: 'Unauthorized', message: 'API key is required. Provide it in X-API_KEY or Authorization header'})
    }

    if (apiKey !== config.apiKey) {
        return res.status(403).json({
            error: 'Forbidden', 
            message: 'Invalid API key'
        })
    }
    next()
}

// validate api key in production
// see if this ocde is necessary for later

export const validateApiKeyProduction = (req, res, next) => {
    if (config.isProduction()) {
        return validateApiKey(req, res, next)
    }
    next()
}

export default validateApiKey
