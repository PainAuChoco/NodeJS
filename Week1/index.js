// Import a module
var http = require("http")
var handle = require("./handle")


http.createServer(handle.serverHandle).listen(1337, "127.0.0.1")