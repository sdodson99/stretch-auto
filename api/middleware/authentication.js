const jwt = require('jsonwebtoken')

//Verify JWT token and add user information to the request header. 
//If authentication fails, do nothing. Individual routes will handle authentication failure results.
function createAuthenticationMiddleware(secretKey){

    return async function(req, res, next){
        const bearerHeader = req.headers['authorization']

        if(bearerHeader){
            const token = bearerHeader.split(" ")[1]
            
            //Decode the JWT.
            jwt.verify(token, secretKey, async (err, decoded) => {

                if(decoded){
                    //Add token information to the request.
                    req.user = decoded
                    next()
                } else {
                    if(err.name == "TokenExpiredError"){
                        res.status(403).json({
                            success: false,
                            error: {
                                code: 1,
                                message: "Token expired."
                            }
                        })
                    } else {
                        next()
                    }
                }
            })
        } else {
            //Move to route even if authentication fails.
            next()
        }
    }
}

module.exports = createAuthenticationMiddleware