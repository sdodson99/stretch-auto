const jwt = require('jsonwebtoken')

/**
 * Create middleware for authenticating users.
 * @param {string} secretKey The secret key for verifying JWT access tokens.
 */
function createAuthenticationMiddleware(secretKey){

    return async function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
            return res.sendStatus(401)
        }

        const splitBearerHeader = bearerHeader.split(" ")
        if(splitBearerHeader.length < 2) {
            return res.sendStatus(401)
        }

        const token = splitBearerHeader[1]

        try {
            const user = jwt.verify(token, secretKey)

            if(!user) {
                return res.sendStatus(401)
            }

            req.user = user
        } catch (error) {
            return res.sendStatus(401)
        }

        next()
    }
}

module.exports = createAuthenticationMiddleware