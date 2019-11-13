const express = require('express')

function createStretchRouter(stretchService, authenticationMiddleware){
    const router = express.Router()

    //Get stretches from stretch service.
    router.get("/", authenticationMiddleware, (req, res) => {
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

    //Create a new stretch.
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

    return router
}

module.exports = createStretchRouter