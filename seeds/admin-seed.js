const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const mongoClient = mongo.MongoClient
const saltRounds = process.env.SALT_ROUNDS || 10

async function seedAdminUser(connectionString){
    let connection = await mongoClient.connect(connectionString)
    
    let adminUser = {
        email: process.env.ADMIN_EMAIL || "admin@stretchauto.com",
        username: process.env.ADMIN_USERNAME || "admin",
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "test123", saltRounds),
        role: "admin"
    }

    let existingUser = await connection.db("stretch").collection("users").findOne({email: adminUser.email})
    if(!existingUser){        
        await connection.db("stretch").collection("users").insertOne(adminUser)
    }

    connection.close()
}

module.exports = seedAdminUser