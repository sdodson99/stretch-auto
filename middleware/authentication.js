const jwt = require('jsonwebtoken')

function createAuthenticationMiddleware(secretKey){

    return function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(bearerHeader){
            const token = bearerHeader.split(" ")[1]
            jwt.verify(token, secretKey, (err, decoded) => {
                if(decoded){
                    req.user = decoded.user
                }
                next()
            })
        } else {
            next()
        }
    }
}

module.exports = createAuthenticationMiddleware