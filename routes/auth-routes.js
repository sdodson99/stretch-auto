const express = require('express')

function createAuthenticationRouter(authService){
    const router = express.Router()

    //Login a user. 
    //Send a signed token with user data if successful.
    //Send a 401 if login unsuccessful.
    router.post("/login", async (req, res) => {

        let email = req.body.email
        let password = req.body.password        

        const loginResponse = await authService.login(email, password)

        if(loginResponse.success){
            res.json({
                success: true,
                content: {
                    accessToken: loginResponse.accessToken,
                    refreshToken: loginResponse.refreshToken
                }
            })
        } else {
            res.status(401).json({
                success: false,
                error: {
                    code: 401,
                    message: loginResponse.error
                }
            })
        }
    })

    //Register a new account.
    //Send a 200 if successful.
    //Send a registration failed error if unsuccessful.
    router.post("/register", async (req, res) => {
        
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        let confirmPassword = req.body.confirmPassword

        const registerResponse = await authService.register(email, username, password, confirmPassword)

        if(registerResponse.success){
            res.json({
                success: true
            })
        } else {
            res.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: registerResponse.error
                }
            })
        }
    })

    //Refresh a token.
    //Send a 403 if error or refresh token is not stored.
    //Send a new access token if valid refresh token.
    router.post("/refresh", async (req, res) => {
        let refreshToken = req.body.refreshToken

        const accessToken = await authService.refresh(refreshToken)

        if(accessToken){
            res.json({
                success: true,
                content: accessToken
            })
        } else {
            res.status(403).json({
                success: false,
                error: {
                    code: 403,
                    message: "Failed to refresh."
                }
            })
        }
    })

    //Logout user.
    //Send a 204 if successful logout.
    //Send a 404 if user not found.
    router.delete("/logout", async (req, res) => {
        let refreshToken = req.body.refreshToken

        if(await authService.logout(refreshToken)){
            res.status(204).json({
                success: true
            })
        } else {
            res.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: "Active user not found."
                }
            })
        }
    })

    return router
}

module.exports = createAuthenticationRouter