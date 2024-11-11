require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const initElasticSearch = require('./dbs/init.elasticsearch')
initElasticSearch.init({ ELASTICSEARCH_IS_ENABLE: true })
require('./dbs/init.mongodb')
const ioredis = require('./dbs/init.ioredis')
ioredis.init({ IOREDIS_IS_ENABLE: true })


require('./tests/inventory.test')
const productTest = require('./tests/product.test')
productTest.purchaseProduct({orderId:1,productId:1})


app.use('/', require('./routes'))

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Error Server'
    })
})

module.exports = app