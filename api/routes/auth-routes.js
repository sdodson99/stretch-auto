const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

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
            res.json(new SuccessResponse({accessToken: loginResponse.accessToken, refreshToken: loginResponse.refreshToken}))
        } else {
            res.status(401).json(new ErrorResponse(401, loginResponse.error))
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
            res.json(new SuccessResponse({}))
        } else {
            res.status(400).json(new ErrorResponse(400, registerResponse.error))
        }
    })

    //Refresh a token.
    //Send a 403 if error or refresh token is not stored.
    //Send a new access token if valid refresh token.
    router.post("/refresh", async (req, res) => {
        let refreshToken = req.body.refreshToken

        const accessToken = await authService.refresh(refreshToken)

        if(accessToken){
            res.json(new SuccessResponse(accessToken))
        } else {
            res.status(403).json(new ErrorResponse(403, "Failed to refresh."))
        }
    })

    //Logout user.
    //Send a 200 if successful logout.
    //Send a 404 if user not found.
    router.post("/logout", async (req, res) => {
        let refreshToken = req.body.refreshToken

        if(await authService.logout(refreshToken)){
            res.json(new SuccessResponse({}))
        } else {
            res.status(404).json(new ErrorResponse(404, "Active user not found."))
        }
    })

    return router
}

module.exports = createAuthenticationRouter