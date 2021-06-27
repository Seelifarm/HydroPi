"use strict"

const http = require('http')
const express = require('express')
const fs = require('fs')
const path = require('path')
const port = 80
const app = express()
const nodeCron = require('node-cron')
const db = require("./db/irrigationPlans")
const knex = require("./db/knex");
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
  console.log("★ New connection found and registered with ID: " + Socket.id);
  Socket.on("sendMessage", function(data){
    console.log("★ " + data)
    //Use data to fill tje job with variables
    manager.add(counter.toString(),'0 * * * * *', function() {
      //use python-shell to execute script
        console.log("★ A Cron Job is running every minute")
    });
    manager.start(counter.toString())
    console.log("★ Started a cron job")
    counter++
    console.log("★ Logging this counter: " + counter)
  });

  Socket.on("createPlan", async function(data){
    console.log("Insert")
    console.log(data.planID)
    const results = await db.createIrrigationPlan({ planID: data.planID, monDuration: 1000});
    //res.status(201).json({ id: results[0] });
    //db.createIrrigationPlan({ planID: 123 });
    //await knex('irrigationPlans').insert({ planID: 123 })

  });
});




// Database
app.use(express.urlencoded({extended: false}));
app.use(express.json());

/* app.post("/irrigationPlans", async (req, res) => {
  const results = await db.createIrrigationPlan(req.body);
  res.status(201).json({ id: results[0] });
}); */




server.listen(port, error => {
  if (error) {
      console.log('★ Something went wrong ', error)
  } else {
      console.log('★ Server is listening on port ' + port)
  }
})