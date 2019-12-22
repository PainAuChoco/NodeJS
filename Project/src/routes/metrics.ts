import { MetricsHandler, Metric } from '../controllers/metrics'
import express = require('express')

module.exports = (function () {
    'use strict';
    const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

    const metricsRouter = express.Router()

    metricsRouter.post('/metrics', (req: any, res: any) => {
        let metric: Metric = new Metric(req.body.timestamp, req.body.value, req.body.id)
        if (req.session.user === undefined || req.session.user === null) {
            dbMet.save(req.body.id, req.body.username, metric, (err: Error | null) => {
                if (err) throw err
                res.status(200).send('metric successfully added');
            })
        } else {
            dbMet.save(req.body.id, req.session.user.username, metric, (err: Error | null) => {
                if (err) throw err
                res.redirect("/metrics");
            })
        }
    })


    metricsRouter.get('/metrics/:id', (req: any, res: any) => {
        if (req.session.user === undefined || req.session.user === null) {
            res.status(401).send('User not logged')
        } else {
            dbMet.getOne(req.params.id, req.session.user.username, (err: Error | null, result: any) => {
                if (err) throw err
                //res.status(200).send(result)
                res.render('metrics.ejs', { metrics: result });
            })
        }
    })

    metricsRouter.get('/metrics/', (req: any, res: any) => {
        if (req.session.user === undefined || req.session.user === null) {
            res.status(401).send('User not logged')
        } else {
            dbMet.getAll(req.session.user.username,
                (err: Error | null, result: any) => {
                    if (err) throw err
                    //res.status(200).send(result)
                    res.render('metrics.ejs', { metrics: result });
                })
        }
    })

    metricsRouter.post('/metrics/delete', (req: any, res: any) => {
        dbMet.delete(req.body.id, (err: Error | null) => {
            if (err) throw err
            //res.status(200).send("element deleted")
            res.redirect('/metrics')
        })
    })

    return metricsRouter
})();