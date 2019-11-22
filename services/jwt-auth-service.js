const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

class JwtAuthService{
    constructor(userService, refreshTokenService, secretKey, secondsUntilExpiration, refreshSecretKey, refreshSecondsUntilExpiration){
        this.userService = userService
        this.refreshTokenService = refreshTokenService

        this.secretKey = secretKey
        this.secondsUntilExpiration = secondsUntilExpiration
        this.refreshSecretKey = refreshSecretKey
        this.refreshSecondsUntilExpiration = refreshSecondsUntilExpiration
    }   

    //Login a user by checking credentials.
    //Return the token and refresh token if valid credentials.
    //Return null if invalid credentials.
    async login(email, password){
        let loginResponse = {}

        //Find the user in the database.
        let user = await this.userService.getByEmail(email)

        //Check user has valid credentials.
        if(user && await bcrypt.compare(password, user.password)){
            const payload = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }

            //Sign tokens.
            const accessToken = jwt.sign(payload, this.secretKey, {expiresIn: this.secondsUntilExpiration})
            const refreshToken = jwt.sign(payload, this.refreshSecretKey, {expiresIn: this.refreshSecondsUntilExpiration})

            //Store refresh token.
            await this.refreshTokenService.create({email: email, refreshToken: refreshToken})

            loginResponse.success = true
            loginResponse.accessToken = accessToken
            loginResponse.refreshToken = refreshToken
        } else {
            loginResponse.success = false
            loginResponse.error = "Invalid credentials."
        }

        return loginResponse
    }

    //Register a user.
    //Return true/false for success.
    async register(email, username, password, confirmPassword){
        let registerResponse = {}        
        let existingUser = await this.userService.getByEmail(email)

        if(password == confirmPassword){

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
                try {
                    await this.userService.create(newUser)    
                    
                    registerResponse.success = true
                } catch (error) {
                    if(error.name == "ValidationError"){
                        registerResponse.error = error.message
                    } else {
                        registerResponse.error = "Failed to register user."
                    }
                }
            } else {
                registerResponse.success = false
                registerResponse.error = "User with email already exists."
            }
        } else {
            registerResponse.success = false
            registerResponse.error = "Password and confirm password must match."
        }

        return registerResponse
    }

    //Get a new access token from a refresh token.
    //Returns the new access token if successful.
    //Returns null if refresh fails.
    async refresh(refreshToken){
        return new Promise((res) => {
            let accessToken = null

            jwt.verify(refreshToken, this.refreshSecretKey, async (err, decoded) => {
                if(decoded){
                    const user = {
                        id: decoded.id,
                        username: decoded.username,
                        email: decoded.email,
                        role: decoded.role
                    }

                    let storedRefreshToken = await this.refreshTokenService.getByRefreshToken(refreshToken)

                    if(storedRefreshToken){
                        accessToken = jwt.sign(user, this.secretKey, {expiresIn: this.secondsUntilExpiration})    
                    }
                }

                res(accessToken)
            })
        })
    }

    //Logout a user by deleting all of their refresh tokens.
    //Returns true/false for success.
    async logout(refreshToken){
        return new Promise((res) => {
            jwt.verify(refreshToken, this.refreshSecretKey, async (err, decoded) => {
                let success = false

                if(decoded){
                    let email = decoded.email
                    success = await this.refreshTokenService.deleteAllForEmail(email)
                }

                res(success)
            })
        })
    }
}

module.exports = JwtAuthService