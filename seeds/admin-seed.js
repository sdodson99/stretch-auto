const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const mongoClient = mongo.MongoClient
const saltRounds = 10

//Seeds an admin user in the database if it does not exist.
async function seedAdminUser(connectionString){
    let connection = await mongoClient.connect(connectionString)
    
    //Create admin user from environment variables.
    let adminUser = {
        email: process.env.ADMIN_EMAIL || "admin@stretchauto.com",
        username: process.env.ADMIN_USERNAME || "admin",
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "test123", saltRounds),
        role: "admin"
    }

    //If user does not already exist, create it.
    let existingUser = await connection.db("stretch").collection("users").findOne({email: adminUser.email})
    if(!existingUser){        
        await connection.db("stretch").collection("users").insertOne(adminUser)
    }

    connection.close()
}

module.exports = seedAdminUser