const express = require('express')
const jwt = require('jsonwebtoken')

function createAuthenticationRouter(authService, secretKey, secondsUntilExpiration){
    const router = express.Router()

    router.post("/login", async (req, res) => {

        let email = req.body.email
        let password = req.body.password

        const user = await authService.login(email, password)

        if(user){
            jwt.sign({user: user}, secretKey, {expiresIn: secondsUntilExpiration}, (err, token) => {
                res.json({token: token})
            })
        } else {
            res.json({error: "Invalid credentials"})
        }
    })

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

    return router
}

module.exports = createAuthenticationRouter