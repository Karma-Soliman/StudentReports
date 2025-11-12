import jwt from 'jsonwebtoken' 
import config from '../config/config.js'

export const verifyToken = (req, res, next) => {
    //get token
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer token 

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorised',
            message: 'Access token is required. Provided it in Authorization header as: Bearer <token>'
        })
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret)

        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        }
        next()

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Unauthorised',
                message: 'Token has expired'
            })
        }
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Invalid Token'
        })
    }
}