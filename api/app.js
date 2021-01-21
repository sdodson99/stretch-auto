require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

// Setup environment constants.
const connectionString = process.env.MONGO_CONNECTION_STRING;
const jwtConfiguration = {
    accessSecret: process.env.JWT_SECRET_KEY,
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
    accessExpiration: "15m",
    refreshExpiration: "90d",
}

// Setup Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('yamljs').load('./swagger/swagger.yaml')
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// Setup Mongoose
const mongoose = require('mongoose')
mongoose.connect(connectionString, 
    {useNewUrlParser: true, reconnectTries: 60, reconnectInterval: 5000, useUnifiedTopology: true, dbName: "stretch"},
    (err) => {
        if(err){
            console.log("MongoDB connection failed: " + err);
        }
    }
);

// Create services.
const MongooseStretchService = require('./services/mongoose/mongoose-stretch-service')
const MongooseUserService = require('./services/mongoose/mongoose-user-service')
const MongooseRoutineService = require('./services/mongoose/mongoose-routine-service')
const MongooseRefreshTokenService = require('./services/mongoose/mongoose-refresh-token-service')
const JwtAuthService = require('./services/jwt-auth-service')

const stretchService = new MongooseStretchService()
const userService = new MongooseUserService()
const routineService = new MongooseRoutineService()
const refreshTokenService = new MongooseRefreshTokenService()
const authService = new JwtAuthService(userService, refreshTokenService, jwtConfiguration)

// Seed data.
const adminSeed = require('./seeds/admin-seed')
adminSeed(userService)

// Create middleware.
const createAuthenticationMiddleware = require('./middleware/authentication')
const authenticationMiddleware = createAuthenticationMiddleware(jwtConfiguration.accessSecret)

// Setup routes.
const StretchRouter = require('./routes/stretch-routes')
const createAuthenticationRouter = require('./routes/authentication-routes')
const createAccountRouter = require('./routes/account-routes')
const RoutineRouter = require('./routes/routine-routes')
app.use("/stretch", StretchRouter(stretchService, authenticationMiddleware))
app.use(createAuthenticationRouter(authService, authenticationMiddleware))
app.use("/account", authenticationMiddleware, createAccountRouter(userService))
app.use("/routine", authenticationMiddleware, RoutineRouter(routineService))

module.exports = app