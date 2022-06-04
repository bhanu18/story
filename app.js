const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')

// load config file

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

const app = express()

// body parser

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

// helpers

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// handle bars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', '.hbs')

// passport
app.use(passport.initialize())
app.use(passport.session())

// global varieble
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

// views
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`));