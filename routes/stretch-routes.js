const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

function createStretchRouter(stretchService, authenticationMiddleware){
    const router = express.Router()

    //Get stretches from stretch service.
    //Send stretches if successful.
    router.get("/", async (req, res) => {
        if(req.query['maxAmount']){
            var stretches = await stretchService.getRandomAmount(req.query['maxAmount'])
        } else {
            var stretches = await stretchService.getAll()
        }

        res.json(new SuccessResponse(stretches))
    })

    //Get a stretch by id from the stretch service.
    //Returns stretch if it exists.
    //Returns 404 if not found.
    router.get("/:stretchId", async (req, res) => {
        const stretchId = req.params.stretchId
        const stretch = await stretchService.getById(stretchId)

        if(stretch){
            res.json(new SuccessResponse(stretch))
        } else {
            res.status(404).json(new ErrorResponse(404, "Stretch not found."))
        }
    })

    //Create a new stretch.
    //Send the created stretch if successful.
    //Send a 403 if user is not admin.
    router.post("/", authenticationMiddleware, async (req, res) => {
        
        //Only admins can create stretches.
        if(req.user && req.user.role == "admin"){
            const stretch = req.body
            
            try {
                let newStretchId = await stretchService.create(stretch)
                stretch._id = newStretchId

                res.json(new SuccessResponse(stretch))
            } catch (error) {
                if(error.name == "ValidationError"){
                    var message = error.message
                } else {
                    var message = "Failed to create stretch."
                }

                res.status(400).json(new ErrorResponse(400, message))
            }

        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    //Update a stretch.
    //Send a 201 if successful.
    //Send a 400 if invalid stretch body.
    //Send a 404 if no stretch found with the id.
    //Send a 403 if the user is not admin.
    router.put("/:stretchId", authenticationMiddleware, async (req, res) => {
        
        //Only admins can delete stretches.
        if(req.user && req.user.role == "admin"){
            const stretchId = req.params.stretchId
            const stretch = req.body

            try {
                let success = await stretchService.update(stretchId, stretch)

                if(success){
                    stretch._id = stretchId
                    res.json(new SuccessResponse(stretch))
                } else {
                    res.status(404).json(new ErrorResponse(404, "Stretch not found."))
                }         
            } catch (error) {
                if(error.name == "ValidationError"){
                    var message = error.message
                } else {
                    var message = "Failed to update stretch."
                }

                res.status(400).json(new ErrorResponse(400, message))
            }

        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        } 
    })

    //Delete a stretch.
    //Send a 204 if successful.
    //Send a 404 if stretch does not exist.
    //Send a 403 if user is not admin.
    router.delete("/:stretchId", authenticationMiddleware, async (req, res) => {
        //Only admins can delete stretches.
        if(req.user && req.user.role == "admin"){
            const stretchId = req.params.stretchId

            if(await stretchService.delete(stretchId)){
                res.status(204).json(new SuccessResponse({}))
            } else {
                res.status(404).json(new ErrorResponse(404, "Stretch not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    return router
}

module.exports = createStretchRouter