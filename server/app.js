"use strict"

const http = require('http')
const express = require('express')
const fs = require('fs')
const path = require('path')
const port = 80
const app = express()
const http = require('node-cron')
var CronJobManager = require('cron-job-manager')
var PythonShell = require('python-shell')
var socket = require('socket.io')
var io = socket(server);
var manager = new CronJobManager()



var htmlPath = path.join(__dirname, 'app')

app.use(express.static(htmlPath))

var server = http.createServer(app)

server.listen(port, error => {
    if (error) {
        console.log('Something went wrong ', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})

var counter = 0
io.sockets.on("connection", function(Socket){
  console.log("New connection found and registered with ID: " + Socket.id);
  Socket.on("sendMessage", function(data){

    //Use data to fill tje job with variables
    manager.add(counter.toString(),'0 * * * * *', function() {
        console.log("Test String - every minute!")
    });

  });
});
