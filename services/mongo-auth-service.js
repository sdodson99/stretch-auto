const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const mongoClient = mongo.MongoClient
const saltRounds = process.env.SALT_ROUNDS || 10

class MongoAuthService{
    constructor(connectionString){
        this.connectionString = connectionString
    }

    async login(email, password){
        let connection = await mongoClient.connect(this.connectionString)
        
        //Find the user in the database.
        let user = await connection.db("stretch").collection("users").findOne({email: email})

        //If the hashed passwords do not match, do not return the user.
        if(user && !(await bcrypt.compare(password, user.password))){
            user = undefined
        }

        connection.close()

        return user
    }

    async register(email, username, password){
        let connection = await mongoClient.connect(this.connectionString)
        let existingUser = await connection.db("stretch").collection("users").findOne({email: email})

        let success

        //If the user already exists, result is unsuccessful.
        if(existingUser){
            success = false
        } else {

            //Hash the password.
            let hashedPassword = await bcrypt.hash(password, saltRounds)
            let newUser = {
                email: email,
                username: username,
                password: hashedPassword
            }

            //Create the new user.
            await connection.db("stretch").collection("users").insertOne(newUser)

            success = true
        }

        connection.close()

        return success;
    }
}

module.exports = MongoAuthService