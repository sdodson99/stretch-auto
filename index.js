(async function(){
    
    //Setup express.
    const express = require('express')
    const cors = require('cors')
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())

    //Setup environment constants.
    const connectionString = process.env.STRETCH_CONNECTION_STRING || "mongodb://localhost:27017/"
    const jwtSecretKey = process.env.JWT_SECRET_KEY || "ilovetostretch"
    const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY || "ilovetorefreshstretch"
    const jwtExpirationSeconds = "15m"
    const jwtRefreshExpirationSeconds = "90d"

    //Setup Mongo database.
    const mongodb = require('mongodb')
    let connection = await mongodb.connect(connectionString, {useUnifiedTopology: true})
    let database = connection.db("stretch")

    //Setup Mongoose
    const mongoose = require('mongoose')
    mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "stretch"})

    //Create services.
    const MongooseStretchService = require('./services/mongoose/mongoose-stretch-service')
    const MongooseUserService = require('./services/mongoose/mongoose-user-service')
    const MongooseRoutineService = require('./services/mongoose/mongoose-routine-service')
    const MongooseRefreshTokenService = require('./services/mongoose/mongoose-refresh-token-service')
    const JwtAuthService = require('./services/jwt-auth-service')

    const stretchService = new MongooseStretchService()
    const userService = new MongooseUserService()
    const routineService = new MongooseRoutineService()
    const refreshTokenService = new MongooseRefreshTokenService()
    const authService = new JwtAuthService(userService, refreshTokenService, jwtSecretKey, jwtExpirationSeconds, jwtRefreshSecretKey, jwtRefreshExpirationSeconds)

    //Seed data.
    const adminSeed = require('./seeds/admin-seed')
    adminSeed(userService)

    //Create middleware.
    const Authentication = require('./middleware/authentication')
    const authenticationMiddleware = Authentication(jwtSecretKey)

    //Setup routes.
    const StretchRouter = require('./routes/stretch-routes')
    const AuthenticationRouter = require('./routes/auth-routes')
    const UserRouter = require('./routes/user-routes')
    const AccountRouter = require('./routes/account-routes')
    const RoutineRouter = require('./routes/routine-routes')
    app.use("/stretch", StretchRouter(stretchService, authenticationMiddleware))
    app.use("/auth", AuthenticationRouter(authService, jwtSecretKey, jwtExpirationSeconds, jwtRefreshSecretKey, jwtRefreshExpirationSeconds))
    app.use("/user", authenticationMiddleware, UserRouter(userService))
    app.use("/account", authenticationMiddleware, AccountRouter(userService))
    app.use("/routine", authenticationMiddleware, RoutineRouter(routineService))

    //Start server.
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
})()