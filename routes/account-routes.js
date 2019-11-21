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
                res.json({
                    success: true,
                    content: foundUser
                })
            } else {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: "User not found."
                    }
                })
            }
        } else {
            res.status(403).json({
                success: false,
                error: {
                    code: 403,
                    message: "Unauthorized."
                }
            })
        }
    })

    return router
}

module.exports = createAccountRouter