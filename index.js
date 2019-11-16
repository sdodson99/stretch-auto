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

//Seed data.
const adminSeed = require('./seeds/admin-seed')
adminSeed(connectionString)

//Create services.
const MongoStretchService = require('./services/mongo-stretch-service')
const MongoAuthService = require('./services/mongo-auth-service')
const MongoGenericService = require('./services/mongo-generic-service')
const stretchService = new MongoStretchService(connectionString)
const authService = new MongoAuthService(connectionString)
const userService = new MongoGenericService(connectionString, "users")
const routineService = new MongoGenericService(connectionString, "routines")

//Create middleware.
const Authentication = require('./middleware/authentication')
const authenticationMiddleware = Authentication(jwtSecretKey)

//Setup routes.
const StretchRouter = require('./routes/stretch-routes')
const AuthenticationRouter = require('./routes/auth-routes')
const UserRouter = require('./routes/user-routes')
const RoutineRouter = require('./routes/routine-routes')
app.use("/stretch", StretchRouter(stretchService, authenticationMiddleware))
app.use("/auth", AuthenticationRouter(authService, jwtSecretKey, jwtExpirationSeconds, jwtRefreshSecretKey, jwtRefreshExpirationSeconds))
app.use("/user", authenticationMiddleware, UserRouter(userService))
app.use("/routine", authenticationMiddleware, RoutineRouter(routineService))

//Start server.
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))