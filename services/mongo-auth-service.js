const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const mongoClient = mongo.MongoClient
const saltRounds = 10

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

    //Find a refresh token record from a refresh token.
    //Returns the record if it exists.
    //Returns undefined if record does not exist.
    async getRefreshToken(refreshToken){
        let connection = await mongoClient.connect(this.connectionString)
        let storedRefreshToken = await connection.db("stretch").collection("refresh_tokens").findOne({refreshToken: refreshToken})
        
        connection.close()

        return storedRefreshToken
    }

    //Insert a refresh token for a user.
    //Returns the id of the inserted token.
    async insertRefreshToken(refreshToken, email){
        let connection = await mongoClient.connect(this.connectionString)
        let insertedResult = await connection.db("stretch").collection("refresh_tokens").insertOne({email: email, refreshToken: refreshToken})
        
        connection.close()

        return insertedResult.insertedId
    }

    //Logout a user by deleting all of their refresh tokens.
    //Returns true/false for at least one refresh token removed.
    async logout(email){
        let connection = await mongoClient.connect(this.connectionString)
        let deletedResult = await connection.db("stretch").collection("refresh_tokens").deleteMany({email: email})
        
        connection.close()

        return deletedResult.deletedCount > 0
    }
}

module.exports = MongoAuthService