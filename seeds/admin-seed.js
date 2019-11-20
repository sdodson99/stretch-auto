const bcrypt = require('bcrypt')
const saltRounds = 10

//Seeds an admin user in the database if it does not exist.
async function seedAdminUser(database){

    //Create admin user from environment variables.
    let adminUser = {
        email: process.env.ADMIN_EMAIL || "admin@stretchauto.com",
        username: process.env.ADMIN_USERNAME || "admin",
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "test123", saltRounds),
        role: "admin"
    }

    //If user does not already exist, create it.
    let existingUser = database.collection("users").findOne({email: adminUser.email})
    if(!existingUser){        
        await database.collection("users").insertOne(adminUser)
    }
}

module.exports = seedAdminUser