const express = require('express')

function createUserRouter(userService){
    const router = express.Router()

    //Get all users.
    //Send the list of users if successful.
    //Send a 403 if the sender does not have permission.
    router.get("/", async (req, res) => {
        if(req.user && req.user.role == "admin"){
            let users = await userService.getAll()
            res.json(users)
        } else {
            res.sendStatus(403)
        }
    })

    //Get a user by id.
    //Send the user if successful.
    //Send a 403 if the sender does not have permission.
    router.get("/:userId", async (req, res) => {
        const userId = req.params.userId
        if(req.user && (req.user.id == userId || res.user.role == "admin")){
            let user = await userService.getById(userId)
            res.json(user)
        } else {
            res.sendStatus(403)
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

        if(!user) res.sendStatus(400)

        if(req.user && (req.user.id == userId || res.user.role == "admin")){

            //Prevent user from changing role.
            user.role = req.user.role

            if(await userService.update(userId, user)){
                user._id = userId
                res.json(user)
            }else{
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(403)
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

module.exports = createUserRouter