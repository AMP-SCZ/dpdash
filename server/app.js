import path from 'path'

import bodyParser from 'body-parser'
import connectLiveReload from 'connect-livereload'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import express from 'express'
import expressSession from 'express-session'
import helmet from 'helmet'
import livereload from 'livereload'
import { MongoClient } from 'mongodb'
import morgan from 'morgan'
import passport from 'passport'
import { Strategy } from 'passport-local'
import favicon from 'serve-favicon'
import winston from 'winston'

import { PASSPORT_FIELDS_ATTRIBUTES } from './constants'
import UserModel from './models/UserModel'
import adminRouter from './routes/admin'
import assessmentData from './routes/assessmentData'
import assessmentsRouter from './routes/assessments'
import authRouter from './routes/auth'
import chartsRouter from './routes/charts'
import configurationsRouter from './routes/configurations'
import dashboardsRouter from './routes/dashboards'
import indexRouter from './routes/index'
import participantsRouter from './routes/participants'
import siteMetadata from './routes/siteMetadata'
import usersRouter from './routes/users'
import userStudiesRouter from './routes/userStudies'
import { verifyHash } from './utils/crypto/hash'

const localStrategy = Strategy
const isProduction = process.env.NODE_ENV === 'production'
const cookieAttributes = {
  secure: isProduction,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'strict',
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

app.use(helmet({ noSniff: true, contentSecurityPolicy: isProduction }))

/** logger setup */
morgan.token('remote-user', function (req) {
  return req.user ? req.user.uid : 'unidentified'
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
  write(message) {
    logger.info(message)
  },
}
app.use(morgan('tiny', { stream: logger.stream }))

/** parsers setup */
app.use(express.static('public'))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(bodyParser.json({ limit: '500mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

/* database setup */
const mongoURI =
  process.env.MONGODB_URI ||
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017/?tls=true&tlsCAfile=global-bundle.pem&retryWrites=false`

const client = new MongoClient(mongoURI, { monitorCommands: true })

app.locals.appDb = client.db()
let firstAdminNotChecked = true
client.on('connectionCreated', async () => {
  if (firstAdminNotChecked) {
    await UserModel.createFirstAdmin(app.locals.appDb)
    firstAdminNotChecked = false
  }
})
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
      mongoUrl: mongoURI,
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())
//passport local strategy
passport.use(
  new localStrategy(
    {
      ...PASSPORT_FIELDS_ATTRIBUTES,
    },
    async (username, password, done) => {
      const { appDb } = app.locals
      const userAttributes = { uid: username }

      const user = await UserModel.findOne(appDb, userAttributes, {
        password: 1,
        role: 1,
        display_name: 1,
        mail: 1,
        icon: 1,
        access: 1,
        account_expires: 1,
        uid: 1,
      })
      if (!user) return done(null, false)

      if (!verifyHash(password, user?.password)) return done(null, false)

      delete user.password

      return done(null, user)
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(async function (user, done) {
  done(null, user)
})

app.use('/', adminRouter)
app.use('/', assessmentsRouter)
app.use('/', assessmentData)
app.use('/', authRouter)
app.use('/', chartsRouter)
app.use('/', configurationsRouter)
app.use('/', dashboardsRouter)
app.use('/', indexRouter)
app.use('/', participantsRouter)
app.use('/', siteMetadata)
app.use('/', usersRouter)
app.use('/', userStudiesRouter)
app.use('./img', express.static(path.join(__dirname, '../public/img')))

app.get('/*', async (req, res, next) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'index.html'),
    (err) => {
      if (err) {
        return next(err)
      }
    }
  )
})

//catch any other error
app.use(function (err, _req, res, _) {
  console.error(err)

  return res.send({ error: err.message })
})

export default app
