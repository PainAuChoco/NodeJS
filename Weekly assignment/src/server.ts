import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler } from './metrics'
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

const app = express()
var path = require('path')
const port: string = process.env.PORT || '1337'


app.use(express.static(path.join(__dirname, '/../public')))
app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req: any, res: any) => {
    res.render('index.ejs')
    res.end()
})

app.get('/hello/:name', (req: any, res: any) => {
    res.render('hello.ejs', { name: req.params.name })
    res.end()
})

app.post('/metrics/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
        if (err) throw err
        res.status(200).send('ok')
    })
})

app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.getOne(
        req.params.id,( err: Error | null, result: any) => {
        if (err) throw err
        //res.status(200).send(result)
        res.render('metrics.ejs',{metrics : result});
    })
})

app.get('/metrics/', (req: any, res: any) => {
    dbMet.getAll(
        (err: Error | null, result: any) => {
            if (err) throw err
            //res.status(200).send(result)
            res.render('metrics.ejs',{metrics : result});
        })
})

app.post('/metrics/delete/:id', (req: any, res: any) => {
    dbMet.delete(
        req.params.id,( err: Error | null) => {
        if (err) throw err
        res.status(200).send("element deleted")
    })
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