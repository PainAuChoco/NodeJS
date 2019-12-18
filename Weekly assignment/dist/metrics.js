"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.getDb = function () {
        return this.db;
    };
    MetricsHandler.prototype.save = function (key, username, metric, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        stream.write({ key: "metric:" + key, value: username + ":" + metric.timestamp + ":" + metric.value });
        stream.end();
        //callback(null)
    };
    MetricsHandler.prototype.get = function (key, callback) {
        var result = this.db.get(key);
        callback(null, result);
    };
    MetricsHandler.prototype.delete = function (key, callback) {
        this.db.del("metric:" + key, function (err) {
            if (err)
                throw err;
            callback(null, null);
        });
    };
    MetricsHandler.prototype.getOne = function (key, username, callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            var usr = data.value.split(':')[0];
            var timestamp = data.value.split(':')[1];
            var value = data.value.split(":")[2];
            var metric = new Metric(timestamp, value, data.key.split(":")[1]);
            if ((key == data.key && username == usr) || username == "admin") {
                metrics.push(metric);
            }
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    MetricsHandler.prototype.getAll = function (username, callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            var usr = data.value.split(':')[0];
            var timestamp = data.value.split(':')[1];
            var value = data.value.split(":")[2];
            var metric = new Metric(timestamp, value, data.key.split(":")[1]);
            console.log(data.key + " : " + timestamp);
            if (usr == username || username == "admin") {
                metrics.push(metric);
            }
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
var Metric = /** @class */ (function () {
    function Metric(ts, v, k) {
        this.timestamp = ts;
        this.value = v;
        this.key = k;
    }
    return Metric;
}());
exports.Metric = Metric;
