import express from 'express'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'
import winston from 'winston'
import favicon from 'serve-favicon'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'
import { MongoClient } from 'mongodb'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import noCache from 'nocache'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'

import assessmentData from './routes/assessmentData'
import adminRouter from './routes/admin'
import authRouter from './routes/auth'
import chartsRouter from './routes/charts'
import configurationsRouter from './routes/configurations'
import countsRouter from './routes/counts'
import dashboardsRouter from './routes/dashboards'
import indexRouter from './routes/index'
import participantsRouter from './routes/participants'
import siteMetadata from './routes/siteMetadata'
import usersRouter from './routes/users'
import { PASSPORT_FIELDS_ATTRIBUTES } from './constants'

const localStrategy = Strategy
const isProduction = process.env.NODE_ENV === 'production'
const cookieAttributes = {
  secure: isProduction,
  maxAge: 24 * 60 * 60 * 1000,
}
const app = express()

if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, '..', 'public', 'js'))
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/*')
    }, 100)
  })
  app.use(connectLiveReload())
}
/** favicon setup */
app.use(favicon(path.join(__dirname, '../public/img/favicon.ico')))

/** security setup */
app.use(
  helmet({
    noSniff: true,
  })
)

app.use(noCache())

/** logger setup */
morgan.token('remote-user', function (req, res) {
  return req.user ? req.user : 'unidentified'
})
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
})
logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  },
}
app.use(morgan('combined', { stream: logger.stream }))

/** parsers setup */
app.use(express.static('public'))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(bodyParser.json({ limit: '500mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(methodOverride())

/* database setup */
let mongodb
const mongoURI = process.env.MONGODB_URI
const mongodbPromise = MongoClient.connect(mongoURI, {
  ssl: false,
  useNewUrlParser: true,
}).then(
  function (res) {
    app.locals.connection = res
    mongodb = res.db()
    app.locals.appDb = res.db()
    app.locals.dataDb = res.db('dpdata')
    res.db().collection('sessions').drop()

    return res
  },
  function (err) {
    console.log('error connecting to mongodb')
    console.log(err)
  }
)

/** session store setup */
app.set('trust proxy', 1)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    proxy: true,
    cookie: cookieAttributes,
    store: MongoStore.create({
      clientPromise: mongodbPromise,
      autoRemove: 'native',
    }),
  })
)

//passport local strategy
passport.use(
  'local-login',
  new localStrategy(PASSPORT_FIELDS_ATTRIBUTES, function (
    username,
    password,
    done
  ) {
    mongodb
      .collection('users')
      .findOne({ uid: username })
      .then(function (user) {
        if (!user) {
          return done(null, false)
        } else {
          return done(null, user)
        }
      })
  })
)

//passport local registeration
passport.use(
  'local-signup',
  new localStrategy(
    {
      ...PASSPORT_FIELDS_ATTRIBUTES,
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      mongodb
        .collection('users')
        .findOne({ uid: username })
        .then(function (err, user) {
          if (!user) {
            return done(null, false, req.body)
          }
          return done(null, true, null)
        })
    }
  )
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', assessmentData)
app.use('/', adminRouter)
app.use('/', authRouter)
app.use('/', chartsRouter)
app.use('/', configurationsRouter)
app.use('/', countsRouter)
app.use('/', dashboardsRouter)
app.use('/', indexRouter)
app.use('/', participantsRouter)
app.use('/', siteMetadata)
app.use('/', usersRouter)
app.use('./img', express.static(path.join(__dirname, '../public/img')))

app.get('/*', async (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'index.html'),
    (err) => {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

//catch any other error
app.use(function (err, req, res, next) {
  if (err) {
    console.error(err)
    return res.status(err.status).json({ error: err.message })
  }
})

export default app
