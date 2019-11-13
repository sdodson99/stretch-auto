const express = require('express')
const jwt = require('jsonwebtoken')

function createAuthenticationRouter(authService, authenticationMiddleware, secretKey, secondsUntilExpiration){
    const router = express.Router()

    //Login a user. 
    //Send a signed JWT with username, email, and role if login successful.
    //Send an invalid credentials error if login unsuccessful.
    router.post("/login", async (req, res) => {

        let email = req.body.email
        let password = req.body.password

        const user = await authService.login(email, password)

        if(user){
            const payload = {
                username: user.username,
                email: user.email,
                role: user.role
            }

            jwt.sign(payload, secretKey, {expiresIn: secondsUntilExpiration}, (err, token) => {
                res.json({token: token})
            })
        } else {
            res.json({error: "Invalid credentials"})
        }
    })

    //Register a new account.
    //Send a 200 if successful.
    //Send a registration failed error if unsuccessful.
    router.post("/register", async (req, res) => {
        
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password

        const success = await authService.register(email, username, password)

        if(success){
            res.sendStatus(200)
        } else {
            res.json({error: "Registration failed"})
        }
    })

    //Get the role of the user from the authentication middleware.
    //Send the role of the user if authenticated.
    //Send a 403 if not authenticated.
    router.get("/role", authenticationMiddleware, (req, res) => {
        if(req.user){
            res.json({role: req.user.role})
        } else {
            res.sendStatus(403)
        }
    })

    return router
}

module.exports = createAuthenticationRouter