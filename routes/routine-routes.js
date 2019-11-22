const express = require('express')
const SuccessResponse = require('../models/responses/success-response')
const ErrorResponse = require('../models/responses/error-response')

function createRoutineRouter(routineService){
    const router = express.Router()

    router.get("/", async (req, res) => {
        const user = req.user

        if(user){
            if(user.role == "admin"){
                var routines = await routineService.getAll()
            } else {
                var routines = await routineService.getAllForUser(user.id)
            }

            res.json(new SuccessResponse(routines))
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    router.get("/:routineId", async (req, res) => {
        const routineId = req.params.routineId
        const user = req.user

        if(user){
            const routine = await routineService.getById(routineId)

            if(routine){
                if(routine.ownerId == user.id || user.role == "admin"){
                    res.json(new SuccessResponse(routine))
                } else {
                    res.status(403).json(new ErrorResponse(403, "Unauthorized."))
                }
            } else {
                res.status(404).json(new ErrorResponse(404, "Routine not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    router.post("/", async (req, res) => {
        const routine = req.body
        const user = req.user

        if(user){
            routine.ownerId = req.user.id

            try {
                let newId = await routineService.create(routine)
                routine._id = newId

                res.json(new SuccessResponse(routine))
            } catch (error) {
                if(error.name == "ValidationError"){
                    var message = error.message
                } else {
                    var message = "Failed to create routine."
                }

                res.status(400).json(new ErrorResponse(400, message))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))
        }
    })

    router.delete("/:routineId", async (req, res) => {
        const routineId = req.params.routineId
        const user = req.user

        if(user){
            const routine = await routineService.getById(routineId)

            if(routine){
                if(routine.ownerId == user.id || user.role == "admin"){
                    if(await routineService.delete(routine._id)){
                        res.status(204).json(new SuccessResponse({}))
                    } else {
                        res.status(404).json(new ErrorResponse(404, "Routine not found."))
                    }
                } else {
                    res.status(403).json(new ErrorResponse(404, "Unauthorized."))
                }
            } else {
                res.status(404).json(new ErrorResponse(404, "Routine not found."))
            }
        } else {
            res.status(403).json(new ErrorResponse(403, "Unauthorized."))            
        }
    })

    return router
}

module.exports = createRoutineRouter