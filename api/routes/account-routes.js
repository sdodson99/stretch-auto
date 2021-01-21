const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

class AccountRouter {
    constructor(userService) {
        this.userService = userService
    }

    async getAccount(req, res) {
        const { user } = req

        const foundUser = await this.userService.getById(user.id)
        if(!foundUser){
            return res.sendStatus(404);
        } 

        return res.json(new SuccessResponse(foundUser))
    }
}

function createAccountRouter(userService){
    const router = express.Router()
    const accountRouter = new AccountRouter(userService)

    router.get("/", (req, res) => accountRouter.getAccount(req, res))

    return router
}

module.exports = createAccountRouter