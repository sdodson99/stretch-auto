const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

const connectionString = process.env.STRETCH_CONNECTION_STRING || "mongodb://localhost:27017/"
const jwtSecretKey = process.env.JWT_SECRET_KEY || "ilovetostretch"
const jwtExpirationSeconds = 3600

const adminSeed = require('./seeds/admin-seed')
adminSeed(connectionString)

const StretchRouter = require('./routes/stretch-routes')
const AuthenticationRouter = require('./routes/auth-routes')
const MongoStretchService = require('./services/mongo-stretch-service')
const MongoAuthService = require('./services/mongo-auth-service')
const Authentication = require('./middleware/authentication')

const stretchService = new MongoStretchService(connectionString)
const authService = new MongoAuthService(connectionString)
const authenticationMiddleware = Authentication(jwtSecretKey)

app.use("/stretch", StretchRouter(stretchService, authenticationMiddleware))
app.use("/auth", AuthenticationRouter(authService, jwtSecretKey, jwtExpirationSeconds))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))