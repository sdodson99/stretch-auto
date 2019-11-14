const express = require('express')

function createStretchRouter(stretchService, authenticationMiddleware){
    const router = express.Router()

    //Get stretches from stretch service.
    //Send stretches if successful.
    router.get("/", (req, res) => {
        if(req.query['maxAmount']){
            stretchService.getRandomAmount(req.query['maxAmount']).then((data) => {
                res.json(data)
            })
        } else {
            stretchService.getAll().then((data) => {
                res.json(data)
            })  
        }
    })

    //Get a stretch by id from the stretch service.
    //Returns stretch if it exists.
    //Returns 404 if not found.
    router.get("/:stretchId", async (req, res) => {
        const stretchId = req.params.stretchId
        const stretch = await stretchService.getById(stretchId)

        if(stretch){
            res.json(stretch)
        } else {
            res.sendStatus(404)
        }
    })

    //Create a new stretch.
    //Send the created stretch if successful.
    //Send a 403 if user is not admin.
    router.post("/", authenticationMiddleware, (req, res) => {
        
        //Only admins can create stretches.
        if(req.user && req.user.role == "admin"){
            const stretch = req.body
            
            stretchService.create(stretch).then((newStretchId) => {
                stretch._id = newStretchId
                res.json(stretch)
            })
        } else {
            res.sendStatus(403)
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
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(403)
        }
    })

    return router
}

module.exports = createStretchRouter