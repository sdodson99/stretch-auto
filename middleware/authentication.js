const jwt = require('jsonwebtoken')

//Verify JWT token and add user information to the request header. 
//If authorization fails, do nothing. Individual routes will handle authorization failure results.
function createAuthenticationMiddleware(secretKey, authService){

    return function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(bearerHeader){
            const token = bearerHeader.split(" ")[1]
            
            //Decode the JWT.
            jwt.verify(token, secretKey, (err, decoded) => {

                if(decoded){
                    //Get the user information from the database based on the JWT email claim.
                    authService.getUser(decoded.email).then((user) => {

                        //Add the user information to the request.
                        req.user = user
                    }).finally(() =>{
                        next()
                    })
                } else {
                    next()
                }
            })
        } else {
            next()
        }
    }
}

module.exports = createAuthenticationMiddleware