const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

function createUserRouter(userService){
    const router = express.Router()

    //Get all users.
    //Send the list of users if successful.
    //Send a 403 if the sender does not have permission.
    router.get("/", async (req, res) => {
        
        if(req.user && req.user.role == "admin"){
            let users = await userService.getAll()
            res.json(new SuccessResponse(users))
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    //Get a user by id.
    //Send the user if successful.
    //Send a 403 if the sender does not have permission.
    router.get("/:userId", async (req, res) => {
        const userId = req.params.userId
        if(req.user && (req.user.id == userId || res.user.role == "admin")){
            let user = await userService.getById(userId)

            if(user){
                res.json(new SuccessResponse(user))
            } else {
                res.status(404).json(new ErrorResponse(404, "User not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    //Update a user at the id.
    //Send the updated user if successful.
    //Send a 404 if user not found.
    //Send a 403 if sender does not have permission.
    //Send a 400 if invalid user body.
    router.put('/:userId', async (req, res) => {
        const userId = req.params.userId
        const user = req.body

        if(req.user && (req.user.id == userId || res.user.role == "admin")){

            //Prevent user from changing role.
            user.role = req.user.role

            try {
                if(await userService.update(userId, user)){
                    user._id = userId
                    res.json(new SuccessResponse(user))
                }else{
                    res.status(404).json(new ErrorResponse(404, "User not found."))
                }
            } catch (error) {
                if(error.name == "ValidationError"){
                    var message = error.message
                } else {
                    var message = "Failed to update user."
                }

                res.status(400).json(new ErrorResponse(400, message))
            }

        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    //Delete a user with the id.
    //Send a 204 if successful.
    //Send a 404 if the user not found.
    //Send a 403 if the sender does not have permission.
    router.delete('/:userId', async (req, res) => {
        const userId = req.params.userId
        if(req.user && (req.user.id == userId || res.user.role == "admin")){
            if(await userService.delete(userId)){
                res.status(204).json(new SuccessResponse({}))
            } else {
                res.status(404).json(new ErrorResponse(404, "User not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    return router
}

module.exports = createUserRouter