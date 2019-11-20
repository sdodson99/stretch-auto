const express = require('express')
const jwt = require('jsonwebtoken')

function createAuthenticationRouter(authService, secretKey, secondsUntilExpiration, refreshSecretKey, refreshSecondsUntilExpiration){
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
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

            //Sign tokens.
            const accessToken = jwt.sign(payload, secretKey, {expiresIn: secondsUntilExpiration})
            const refreshToken = jwt.sign(payload, refreshSecretKey, {expiresIn: refreshSecondsUntilExpiration})

            //Store refresh token.
            await authService.insertRefreshToken(refreshToken, user.email)

            res.json({accessToken: accessToken, refreshToken: refreshToken})
        } else {
            res.json({errorMessage: "Invalid credentials."})
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

    //Refresh a token.
    //Send a 403 if error or refresh token is not stored.
    //Send a new access token if valid refresh token.
    router.post("/refresh", async (req, res) => {
        let refreshToken = req.body.refreshToken

        jwt.verify(refreshToken, refreshSecretKey, async (err, decoded) => {
            if(err) res.sendStatus(403)

            const user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
            }

            let storedRefreshToken = await authService.getRefreshToken(refreshToken)

            if(storedRefreshToken){
                let accessToken = jwt.sign(user, secretKey, {expiresIn: secondsUntilExpiration})
                res.json({accessToken: accessToken})
            } else {
                res.sendStatus(403)
            }
        })
    })

    //Logout and clear tokens.
    //Send a 403 if token verification fails.
    //Send a 204 if successful logout.
    router.delete("/logout", async (req, res) => {
        let refreshToken = req.body.refreshToken

        jwt.verify(refreshToken, refreshSecretKey, async (err, decoded) => {
            if(err) res.sendStatus(403)

            let email = decoded.email
            await authService.logout(email)

            res.sendStatus(204)
        })
    })

    return router
}

module.exports = createAuthenticationRouter