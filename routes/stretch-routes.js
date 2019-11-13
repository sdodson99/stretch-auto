const express = require('express')

function createStretchRouter(stretchService, authenticationMiddleware){
    const router = express.Router()

    router.get("/", authenticationMiddleware, (req, res) => {
        if(req.user){
            if(req.query['maxAmount']){
                stretchService.getRandomAmount(req.query['maxAmount']).then((data) => {
                    res.json(data)
                })
            } else {
                stretchService.getAll().then((data) => {
                    res.json(data)
                })  
            }
        } else {
            res.sendStatus(403)
        }
    })

    router.post("/", authenticationMiddleware, (req, res) => {
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