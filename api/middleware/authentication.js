const jwt = require('jsonwebtoken')

/**
 * Create middleware for authenticating users.
 * @param {string} secretKey The secret key for verifying JWT access tokens.
 */
function createAuthenticationMiddleware(secretKey){

    return async function(req, res, next){
        const bearerHeader = req.headers['Authorization']

        if(!bearerHeader) {
            return res.sendStatus(401)
        }

        const splitBearerHeader = bearerHeader.split(" ")
        if(splitBearerHeader.length < 2) {
            return res.sendStatus(401)
        }

        const token = splitBearerHeader[1]

        const verificationResult = jwt.verify(token, secretKey)

        const decodedUser = verificationResult.decoded
        if(!decodedUser) {
            return res.sendStatus(401)
        }

        req.user = decodedUser

        next()
    }
}

module.exports = createAuthenticationMiddleware