module.exports = {
    serverHandle: function (req, res) {
        const url = require('url')
        const qs = require('querystring')
        const route = url.parse(req.url)
        const path = route.pathname
        const params = qs.parse(route.query)
        console.log(path)



        if (path === '/hello') {
            if ('name' in params) {
                if (params['name'] === 'arnaud') {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write("<h3>Hello, I am Arnaud. I wrote this program for my NodeJS exercice to please my beloved teacher Sergei!<h3/>")
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write('<h3>Hello ' + params['name'] + '! Welcome to my first website !<h3/>')
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h3>Hello anonymous! Would you care to add ?name=YOUR_NAME to the url, it\'s worth it !<h3/>')
            }
        } else if (path === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("<h3>This program says hello with your name at the end ! Add /hello?name=YOUR_NAME to the url and receive personalized greetings!<h3/>")
        } else if (path !== '/' && path !== 'hello') {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.write("<h3>Error 404 Page not Found<h3/>")
        }

        res.end();
    }
}