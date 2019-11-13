const jwt = require('jsonwebtoken')

//Verify JWT token and add user information to the request header. 
//If authorization fails, do nothing. Individual routes will handle authorization failure results.
function createAuthenticationMiddleware(secretKey, authService){

    return async function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(bearerHeader){
            const token = bearerHeader.split(" ")[1]
            
            //Decode the JWT.
            jwt.verify(token, secretKey, async (err, decoded) => {

                try {
                    if(decoded){
                        //Add user information to the request based on the JWT email claim.
                        req.user = await authService.getUser(decoded.email)

                        //Add token information to the request.
                        //In the future, we will use this data once we setup refresh tokens.
                        req.auth = decoded
                    } else {
                        //Set the authentication error name.
                        req.authError = err.name
                    }
                } finally {
                    next()
                }
            })
        } else {
            next()
        }
    }
}

module.exports = createAuthenticationMiddleware