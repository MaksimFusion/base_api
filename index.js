require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const model = require('./models/model')
const cors = require('cors')
const router = require('./routers/index')
const errorHandlingMiddleware= require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandlingMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()