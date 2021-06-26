"use strict"

const http = require('http')
const express = require('express')
const fs = require('fs')
const path = require('path')
const port = 80
const app = express()
const nodeCron = require('node-cron')
var CronJobManager = require('cron-job-manager')
var PythonShell = require('python-shell')
var socket = require('socket.io')
var server = http.createServer(app)
var io = socket(server);
var manager = new CronJobManager()
var htmlPath = path.join(__dirname, 'app')
app.use(express.static(htmlPath))

var counter = 0
io.sockets.on("connection", function(Socket){
  console.log("New connection found and registered with ID: " + Socket.id);
  Socket.on("sendMessage", function(data){
    console.log(data)
    //Use data to fill tje job with variables
    manager.add(counter.toString(),'0 * * * * *', function() {
        console.log("Test String - every minute!")
    });
    console.log("cronjob done")
  });
});

server.listen(port, error => {
    if (error) {
        console.log('Something went wrong ', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})


