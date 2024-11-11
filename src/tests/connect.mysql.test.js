
const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'shopDEV'
})

pool.query('SELECT * from users', (err, results) => {
    console.log(`query result: `, results)
    pool.end(err => {
        console.log(`Connection closed `)
    })
})