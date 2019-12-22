import express = require('express')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')
var morgan = require('morgan')

const LevelStore = levelSession(session)

const app = express()
var path = require('path')
const port: string = process.env.PORT || '1337'

app.use(express.static(path.join(__dirname, '/../public')))
app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.use(morgan('dev'))

app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true,
}))

app.use(function (req: any, res: any, next) {
    res.locals.user = req.session.user;
    next();
});

app.use("/public", express.static('./public/'));

var userRouter = require('./routes/user');
app.use('/', userRouter);

var metricsRouter = require('./routes/metrics');
app.use('/', metricsRouter);

app.get('/', (req: any, res: any) => {
    res.redirect('login')
})

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.status(404).send('<h2>Error 404 : Page not found<h2/>');
});

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})