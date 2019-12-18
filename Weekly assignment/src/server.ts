import express = require('express')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')
var morgan = require('morgan')


import { UserHandler, User } from './user'
import { MetricsHandler, Metric } from './metrics'
import { stringify } from 'querystring'

const LevelStore = levelSession(session)
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()


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

app.use(function(req: any, res: any, next) {
    res.locals.user = req.session.user;
    next();
  });

authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
    res.render('signup')
})

authRouter.post('/signup/', (req: any, res: any) => {
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    var newuser = new User(username, email, password, false)
    dbUser.save(newuser, (err: Error | null) => {
    })
    req.session.loggedIn = true
    req.session.user = newuser
    res.redirect('/metrics')
})

authRouter.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
})

authRouter.post('/login', (req: any, res: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login')
        } else {
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/metrics')
        }
    })
})

app.use(authRouter)
const userRouter = express.Router()

userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists")
        } else {
            dbUser.save(req.body, function (err: Error | null) {
                if (err) next(err)
                else res.status(201).send("user persisted")
            })
        }
    })
})


userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    })
})

app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', { name: req.session.user.username })
})

app.get('/account', authCheck, (req: any, res: any) => {
    res.render('account.ejs')
})

app.post('/user/update', (req: any, res: any) => {
    let email = req.body.email
    var usr = new User(req.session.user.username, email, req.session.user.password, false)
    dbUser.save(usr, (err: Error | null) => {
    })
    req.session.user = usr
    res.redirect('/account')
})

app.post('/user/delete', (req: any, res: any)=>{
    dbUser.delete(req.body.username, (err: Error | null) => {
        if (err) throw err
        res.redirect('/logout')
    })
})

app.post('/user/deleteadmin', (req: any, res: any)=>{
    dbUser.delete(req.body.username, (err: Error | null) => {
        if (err) throw err
        res.redirect('/admin')
    })
})

app.get('/admin', authCheck, (req: any, res: any)=> {
    dbUser.getAll((err: Error | null, result: any) => {
        if(err) throw err
        res.render('admin.ejs', {users: result})
    })
})

app.post('/metrics', (req: any, res: any) => {
    let metric: Metric = new Metric(req.body.timestamp, req.body.value, req.body.id)
    dbMet.save(req.body.id, req.session.user.username, metric, (err: Error | null) => {
        if (err) throw err
        //res.status(200).send('ok')
        res.redirect("/metrics");
    })
})


app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.getOne(req.params.id, req.session.user.username, (err: Error | null, result: any) => {
        if (err) throw err
        //res.status(200).send(result)
        res.render('metrics.ejs', { metrics: result });
    })
})

app.get('/metrics/', (req: any, res: any) => {
    dbMet.getAll(req.session.user.username,
        (err: Error | null, result: any) => {
            if (err) throw err
            //res.status(200).send(result)
            res.render('metrics.ejs', { metrics: result });
        })
})

app.post('/metrics/delete', (req: any, res: any) => {
    dbMet.delete(req.body.id, (err: Error | null) => {
        if (err) throw err
        //res.status(200).send("element deleted")
        res.redirect('/metrics')
    })
})

app.post('/metrics/deleteall', (req: any, res: any) => {
    dbMet.getAll("admin",
        (err: Error | null, result: any) => {
            if (err) throw err
            result.forEach(metric => {
                dbMet.delete(metric.key, (err: Error | null) => {
                    if (err) throw err
                    res.status(200).send("all metrics deleted")
                })
            });
        })
})

app.get('/users', (req: any, res: any) => {
    dbUser.getAll((err: Error | null, result: any) => {
        if (err) throw err
        res.status(200).send(result)
    })
})

app.post('/users/delete/', (req: any, res: any) => {
    dbUser.delete(req.body.username, (err: Error | null) => {
        if (!err)
            res.status(200).send("element deleted")
    })
})

app.use("/public", express.static('./public/'));

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