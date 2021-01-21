const bcrypt = require('bcrypt')
const saltRounds = 10

/**
 * Seed an admin user for the application if one does not exist.
 * @param {*} userService The user service to save the user with.
 */
async function seedAdminUser(userService){
    const adminUser = {
        email: process.env.ADMIN_USER_EMAIL,
        username: process.env.ADMIN_USER_USERNAME,
        password: await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, saltRounds),
        role: "admin"
    }

    const existingAdmin = await userService.getByEmail(adminUser.email)

    if(!existingAdmin){        
        await userService.create(adminUser)
    }
}

module.exports = seedAdminUser