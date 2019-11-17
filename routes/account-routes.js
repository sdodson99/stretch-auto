const express = require('express')

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
                res.json(foundUser)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(403)
        }
    })

    return router
}

module.exports = createAccountRouter