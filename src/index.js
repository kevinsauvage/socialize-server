const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route')
const searchRoute = require('./routes/search.route')
const commentRoute = require('./routes/comment.route')
const config = require('./config/cors')
const SocketService = require('./socket')

// MongoDb
const db = require('./models/index')

// defining the Express app
const app = express()

// adding Helmet to enhance your API's security
app.use(helmet())

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json({ limit: '5000mb' }))
// cors whitelist
app.use(
  cors({
    origin: (origin, callback) => {
      if (config.cors.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        const error = new Error('Not allowed by CORS')
        error.status = 403
        callback(error)
      }
    },
  }),
)

// Connect to mongo db
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log('Connected to the database!')
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// adding morgan to log HTTP requests
app.use(morgan('combined'))

// defining an endpoint for user
app.use(postRoute)
app.use(userRoute)
app.use(commentRoute)
app.use(searchRoute)
app.use('/', (req, res) => res.send('Working!!!'))

// defining default route
app.use(async (req, res, next) => {
  res.status(404).json({ message: 'Not found' })
})

// starting the server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('listening on port 5000')
})

app.set('socketService', new SocketService(server))
