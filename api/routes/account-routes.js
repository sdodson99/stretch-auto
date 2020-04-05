const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

function createAccountRouter(userService){
    const router = express.Router()

    //Get account information.
    //Returns the user if successful.
    //Returns a 404 if the user not found.
    //Returns a 403 if unauthorized.
    router.get("/", async (req, res) => {
        let user = req.user

        if(user){
            let foundUser = await userService.getById(user.id)

            if(foundUser){
                res.json(new SuccessResponse(foundUser))
            } else {
                res.status(404).json(new ErrorResponse(404, "User not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    return router
}

module.exports = createAccountRouter