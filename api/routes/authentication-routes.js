const express = require('express')
const { EmailAlreadyExistsError, ConfirmPasswordError, EmailNotFoundError, InvalidPasswordError, RefreshTokenNotFoundError } = require('../errors')
const { ValidationError } = require("mongoose").Error
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

class AuthenticationRouter {
    constructor(authService) {
        this.authService = authService
    }

    async login(req, res) {
        const { email, password }  = req.body;   

        try {
            const tokenResponse = await this.authService.login(email, password)
            return res.json(new SuccessResponse(tokenResponse))
        } catch (error) {
            if(error instanceof EmailAlreadyExistsError) {
                return res.status(409).send(error.message)
            }
            if(error instanceof ConfirmPasswordError) {
                return res.status(400).send(error.message)
            }
            if(error instanceof ValidationError) {
                return res.status(400).send(error.message)
            }

            return res.sendStatus(500);
        }
    }

    async register(req, res) {
        const { email, username, password, confirmPassword} = req.body

        try {
            await this.authService.register(email, username, password, confirmPassword)
            return res.sendStatus(201);
        } catch (error) {
            if(error instanceof EmailAlreadyExistsError) {
                return res.status(409).send(error.message)
            }
            if(error instanceof ConfirmPasswordError) {
                return res.status(400).send(error.message)
            }
            if(error instanceof ValidationError) {
                return res.status(400).send(error.message)
            }

            return res.sendStatus(500);
        }
    }

    async refresh(req, res) {
        const  {refreshToken } = req.body

        try {
            const tokenResponse = await this.authService.refresh(refreshToken)
            return res.json(new SuccessResponse(tokenResponse))
        } catch (error) {
            if(error instanceof RefreshTokenNotFoundError) {
                return res.status(404).send(error.message)
            }

            return res.sendStatus(500)
        }
    }

    async logout(req, res) {
        const { user } = req;

        try {
            await this.authService.logoutEverywhere(user.id);
            return res.sendStatus(204);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
}

function createAuthenticationRouter(authService, authenticationMiddleware){
    const router = express.Router()
    const authenticationRouter = new AuthenticationRouter(authService)

    router.post("/login", (req, res) => authenticationRouter.login(req, res))
    router.post("/register", (req, res) => authenticationRouter.register(req, res))
    router.post("/refresh", (req, res) => authenticationRouter.refresh(req, res))
    router.delete("/logout", authenticationMiddleware, (req, res) => authenticationRouter.logout(req, res))

    return router
}

module.exports = createAuthenticationRouter