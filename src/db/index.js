// importing database
const { Pool } = require('pg')

console.log(`initializing database...`)

// initialize database
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    max: process.env.PG_MAX_CONNECTIONS,
})

console.log(`database ok.`)

module.exports = {
    query: (text, params) => {
        // wrap it in a promise
        return new Promise((resolve, reject) => {
            pool.query(text, params, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },
}