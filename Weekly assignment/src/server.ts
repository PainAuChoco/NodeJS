import express = require('express')
import { MetricsHandler } from './metrics'

const app = express()
var path = require('path')
const port: string = process.env.PORT || '1337'

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '\\views')
app.set('view engine', 'ejs')

app.get('/', (req: any, res: any) => {
    res.render('index.ejs')
    res.end()
})

app.get('/hello/:name', (req: any, res: any) => {
    res.render('hello.ejs', { name: req.params.name })
    res.end()
})

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
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