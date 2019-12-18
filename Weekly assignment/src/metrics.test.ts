import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test_metrics'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.getDb().close()
  })

  describe('#save', function () {
    it('should save data', function () {
      let metric: Metric = new Metric("010101", 1, "key")
      dbMet.save("test", "admin", metric, function (err: Error | null) {
        expect(err).to.be.undefined
      })
    })
  })

  describe('#get', function () {
    it('should get empty array on non existing group', function () {
      let metric: Metric = new Metric("010101", 10, "key")
      dbMet.save("key", "admin", metric, function (err: Error | null) {
        dbMet.getOne("test", "admin", function (err: Error | null, result?: Metric) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.not.be.empty
        })
      })
    })
  })

  describe('#update', function () {
    it("should update metrics", function () {
      let metric: Metric = new Metric("2019-01-01", 10, "key")
      dbMet.save("key","username", metric, function (err: Error | null) {
        metric.value = 12
        dbMet.save("key","username", metric, function (err: Error | null) {
          dbMet.get("key", function (err: Error | null, result?: Metric) {
            expect(result).to.not.be.undefined
            if (result !== undefined && result !== null && result.value !== undefined) expect(result.value).to.be.equal(12)
          })
        })
      })
    })
  })

  describe('#delete', function () {
    it("should delete data", function () {
      let metric: Metric = new Metric("010101", 1, "key")
      dbMet.save("key", "username", metric, function (err: Error | null) {
        dbMet.delete("key", function (err: Error | null) {
          expect(err).to.be.null;
        })
      })
    })
  })
})


