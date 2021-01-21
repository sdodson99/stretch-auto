const jwt = require('jsonwebtoken')

/**
 * Create middleware for authenticating users.
 * @param {string} secretKey The secret key for verifying JWT access tokens.
 */
function createAuthenticationMiddleware(secretKey){

    return async function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(!bearerHeader) {
            return res.sendStatus(401)
        }

        const splitBearerHeader = bearerHeader.split(" ")
        if(splitBearerHeader.length < 2) {
            console.log(2);
            return res.sendStatus(401)
        }

        const token = splitBearerHeader[1]

        const user = jwt.verify(token, secretKey)
        if(!user) {
            return res.sendStatus(401)
        }

        req.user = user

        next()
    }
}

module.exports = createAuthenticationMiddleware