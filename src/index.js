// initialize environment variables
require('dotenv').config()

// importing Koa web server
const Koa = require('koa')
// because frontend and backend can be served completely on two different servers
// we have to allow cross origin requests
const cors = require('@koa/cors')  
const bodyParser = require('koa-bodyparser');
// importing database
const db = require('./db')

const notification = require('./notification')

// importing processing router
const processingRouter = require('./processing')

console.log('initializing server...')

// initialize web server
const server = new Koa()

// pass the database handler to the web server
server.context.db = db
// pass the notification handler to the web server
server.context.notification = notification

server.use(cors({origin: '*'})) // allows CORS requests from any origin
      .use(bodyParser())        //allows server to parse post requests    
      .use(processingRouter.routes())     // add the processing router
      .use(processingRouter.allowedMethods())

server.listen(process.env.PORT)
console.log('server ok.')
