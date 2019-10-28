const express = require('express')
const MongoStretchService = require('../services/mongo-stretch-service')

const router = express.Router()

const StretchRouter = function(connectionString){
    this.stretchService = new MongoStretchService(connectionString)

    router.get("/", (req, res) => {
        if(req.query['maxAmount']){
            this.stretchService.getRandomAmount(req.query['maxAmount']).then((data) => {
                res.json(data)
            })
        } else {
            this.stretchService.getAll().then((data) => {
                res.json(data)
            })        
        }
    })

    this.getRouter = function(){
        return router
    }
}

module.exports = StretchRouter