const express = require('express')

function createRoutineRouter(routineService){
    const router = express.Router()

    router.get("/", async (req, res) => {
        const user = req.user

        if(user){
            let stretches

            if(user.role == "admin"){
                stretches = await routineService.getAll()
            } else {
                stretches = await routineService.getAllForUser(user.id)
            }

            res.json(stretches)
        } else {
            res.sendStatus(403)
        }
    })

    router.get("/:routineId", async (req, res) => {
        const routineId = req.params.routineId
        const user = req.user

        if(user){
            const routine = await routineService.getById(routineId)

            if(routine){
                if(routine.ownerId == user.id || user.role == "admin"){
                    res.json(routine)
                } else {
                    res.sendStatus(403)
                }
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(403)
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
                res.json(routine)
            } catch (error) {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(403)
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
                        res.sendStatus(204)
                    } else {
                        res.sendStatus(404)
                    }
                } else {
                    res.sendStatus(403)
                }
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(403)
        }
    })

    return router
}

module.exports = createRoutineRouter