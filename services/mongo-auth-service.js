const bcrypt = require('bcrypt')
const saltRounds = 10

class MongoAuthService{
    constructor(database){
        this.database = database
    }

    //Login a user by checking credentials.
    //Return the user if valid credentials.
    //Return undefinited if invalid credentials.
    async login(email, password){
        //Find the user in the database.
        let user = await this.database.collection("users").findOne({email: email})

        //If the hashed passwords do not match, return undefined.
        if(user && !(await bcrypt.compare(password, user.password))){
            user = undefined
        }

        return user
    }

    //Register a user.
    //Return true/false for success.
    async register(email, username, password){
        let success = false        
        let existingUser = await this.database.collection("users").findOne({email: email})

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
            let insertResult = await this.database.collection("users").insertOne(newUser)

            //Check if the user was created.
            if(insertResult.insertedCount == 1){
                success = true
            }
        }

        return success;
    }

    //Find a refresh token record from a refresh token.
    //Returns the record if it exists.
    //Returns undefined if record does not exist.
    async getRefreshToken(refreshToken){
        return await this.database.collection("refresh_tokens").findOne({refreshToken: refreshToken})
    }

    //Insert a refresh token for a user.
    //Returns the id of the inserted token.
    async insertRefreshToken(refreshToken, email){
        let insertResult = await this.database.collection("refresh_tokens").insertOne({email: email, refreshToken: refreshToken})

        return insertResult.insertedId
    }

    //Logout a user by deleting all of their refresh tokens.
    //Returns true/false for at least one refresh token removed.
    async logout(email){
        let deleteResult = await this.database.collection("refresh_tokens").deleteMany({email: email})

        return deleteResult.deletedCount > 0
    }
}

module.exports = MongoAuthService