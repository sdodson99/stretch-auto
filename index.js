const express = require('express')
const cors = require('cors')
const StretchRouter = require('./routes/stretch-routes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

const connectionString = "mongodb://stretch-db:27017/"

app.use("/stretch", new StretchRouter(connectionString).getRouter())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))