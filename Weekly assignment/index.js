const express = require('express')
const app = express()
const metrics = require('./metrics')
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + "\\views")
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('index.ejs'))

app.get('/hello/:name', (req, res) => res.render('hello.ejs', { name: req.params.name }))

app.get('/metrics.js', (req, res) => {
    metrics.get((err, data) => {
        if (err) throw err
        res.status(200).json(data)
    })
})

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.status(404).send('<h2>Error 404 : Page not found<h2/>');
});

app.listen(1337)