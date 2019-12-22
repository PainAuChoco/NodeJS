#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/controllers/metrics'
import { User, UserHandler } from '../src/controllers/user'
import { LevelDB } from "../src/leveldb"

const dbPathMet: string = './db/metrics'
const dbPathUsr: string = './db/users'

const users = [
  new User("arnaud", "arnaud.emprin@edu.ece.fr", "pass"),
  new User("jean", "jean.leroy@edu.ece.fr", "pass"),
  new User("admin", "admin@edu.ece.fr", "admin")
]

const metrics = [
  new Metric("2019-12-08", 12, "1"),
  new Metric("2019-10-05", 35, "2"),
  new Metric("2020-01-01", 22, "3"),
  new Metric("2019-12-03", 12, "4"), 
  new Metric("2019-04-07", 52, "5"),
]

LevelDB.clear(dbPathMet)
const dbMet = new MetricsHandler(dbPathMet)

LevelDB.clear(dbPathUsr)
const dbUsr = new UserHandler(dbPathUsr)

users.forEach(user => {
  dbUsr.save(user, (err: Error | null) => {
    if (err) throw err
  })
})

console.log("User database populated")

dbMet.save("1", "arnaud", metrics[0], (err: Error | null) => {
  if (err) throw err
})
dbMet.save("2", "arnaud", metrics[1], (err: Error | null) => {
  if (err) throw err
})
dbMet.save("3", "arnaud", metrics[2], (err: Error | null) => {
  if (err) throw err
})

dbMet.save("4", "jean", metrics[3], (err: Error | null) => {
  if (err) throw err
})

dbMet.save("5", "jean", metrics[4], (err: Error | null) => {
  if (err) throw err
  console.log('Metrics database populated')
})
