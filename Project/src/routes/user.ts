import { UserHandler, User } from '../controllers/user'
import express = require('express')

module.exports = (function () {
    'use strict';
    const userRouter = express.Router()
    const dbUser: UserHandler = new UserHandler('./db/users')

    const authCheck = function (req: any, res: any, next: any) {
        if (req.session.loggedIn) {
            next()
        } else res.redirect('/login')
    }

    userRouter.get('/account', authCheck, (req: any, res: any) => {
        res.render('account.ejs')
    })

    userRouter.post('/user/update', (req: any, res: any) => {
        let email = req.body.email
        var usr = new User(req.session.user.username, email, req.session.user.password, false)
        dbUser.save(usr, (err: Error | null) => {
        })
        req.session.user = usr
        res.redirect('/account')
    })

    userRouter.post('/user/delete', (req: any, res: any) => {
        dbUser.delete(req.body.username, (err: Error | null) => {
            if (err) throw err
            res.redirect('/logout')
        })
    })

    userRouter.post('/user/deleteadmin', (req: any, res: any) => {
        dbUser.delete(req.body.username, (err: Error | null) => {
            if (err) throw err
            res.redirect('/admin')
        })
    })

    userRouter.get('/admin', authCheck, (req: any, res: any) => {
        dbUser.getAll((err: Error | null, result: any) => {
            if (err) throw err
            res.render('admin.ejs', { users: result })
        })
    })

    userRouter.get('/users', (req: any, res: any) => {
        dbUser.getAll((err: Error | null, result: any) => {
            if (err) throw err
            res.status(200).send(result)
        })
    })

    userRouter.get('/users/:username', (req: any, res: any, next: any) => {
        dbUser.get(req.params.username, function (err: Error | null, result?: User) {
            if (err || result === undefined) {
                res.status(404).send("user not found")
            } else res.status(200).json(result)
        })
    })
    
    userRouter.get('/login', (req: any, res: any) => {
        res.render('login')
    })

    userRouter.get('/signup', (req: any, res: any) => {
        res.render('signup')
    })

    userRouter.post('/signup/', (req: any, res: any) => {
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

    userRouter.get('/logout', (req: any, res: any) => {
        delete req.session.loggedIn
        delete req.session.user
        res.redirect('/login')
    })

    userRouter.post('/login', (req: any, res: any) => {
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

    return userRouter
})();
