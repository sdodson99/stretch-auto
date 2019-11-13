const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const mongoClient = mongo.MongoClient
const saltRounds = process.env.SALT_ROUNDS || 10

class MongoAuthService{
    constructor(connectionString){
        this.connectionString = connectionString
    }

    //Login a user by checking credentials.
    //Return the user if valid credentials.
    //Return undefinited if invalid credentials.
    async login(email, password){
        let connection = await mongoClient.connect(this.connectionString)
        
        //Find the user in the database.
        let user = await connection.db("stretch").collection("users").findOne({email: email})

        //If the hashed passwords do not match, return undefined.
        if(user && !(await bcrypt.compare(password, user.password))){
            user = undefined
        }

        connection.close()

        return user
    }

    //Register a user.
    //Return true/false for success.
    async register(email, username, password){
        let success = false        

        let connection = await mongoClient.connect(this.connectionString)
        let existingUser = await connection.db("stretch").collection("users").findOne({email: email})

        //If the user does not already exist, register them.
        if(!existingUser){

            //Hash the password.
            let hashedPassword = await bcrypt.hash(password, saltRounds)
            let newUser = {
                email: email,
                username: username,
                password: hashedPassword
            }

            //Create the new user.
            let insertResult = await connection.db("stretch").collection("users").insertOne(newUser)

            //Check if the user was created.
            if(insertResult.insertedCount == 1){
                success = true
            }
        }

        connection.close()

        return success;
    }

    //Get a user from the database.
    //Returns the user if it exists.
    //Returns undefinied if it does not exist.
    async getUser(email){
        let connection = await mongoClient.connect(this.connectionString)
        let user = await connection.db("stretch").collection("users").findOne({email: email})
        
        connection.close()

        return user
    }
}

module.exports = MongoAuthService