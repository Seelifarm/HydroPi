"use strict"



const http = require('http')

const express = require('express')

const fs = require('fs')

const path = require('path')

const port = 80

const app = express()

const nodeCron = require('node-cron')

const db = require("./db/entities")

var CronJobManager = require('cron-job-manager')

var PythonShell = require('python-shell')

var socket = require('socket.io')

var server = http.createServer(app)

var io = socket(server);

var manager = new CronJobManager()

var htmlPath = path.join(__dirname, 'app')

app.use(express.static(htmlPath))



var counter = 0

var clients = {}

io.sockets.on("connection", function(Socket){

  console.log("★ New connection found and registered with ID: " + Socket.id);

  clients[Socket.id] = Socket;

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



  //DB interfaces for table irrigationPlans
  Socket.on("createPlan", async function(data){
    await db.insertEntity('irrigationPlans', data)
  });

  Socket.on("updatePlan", async function(data){
    await db.updateEntity('irrigationPlans', 'planID', data.planID, data)
  });

  Socket.on("deletePlan", async function(data){
    await db.deleteEntity('irrigationPlans', 'planID', data.planID)
  });

  //DB update interface for channels
  Socket.on("updateChannels", async function(data){
    await db.updateEntity('channels', 'channelID', data.channelID, data)
  });

  //DB interfaces for table planXChannel
  Socket.on("createPXC", async function(data){
    await db.insertEntity('planXChannel', data)
  });

  Socket.on("updatePXC", async function(data){
    await db.updateEntity('planXChannel', 'planID', data.planID, data)
  });

  Socket.on("deletePXCByPID", async function(data){
    await db.deleteEntity('planXChannel', 'planID', data.planID)
  });

  Socket.on("deleteSpecificInPXC", async function(data){
    await db.deleteSpecificEntity('planXChannel', 'planID', data.planID, 'channelID', data.channelID)
  });

  //Data to client as JSON
  Socket.on("requestData", async function(data){
    // send a message to the destination
    Socket.emit("fetchChannels" , JSON.stringify(await db.getAllEntities(data.tableName)));
    Socket.emit("fetchIrrigationPlans" , JSON.stringify(await db.getAllEntities(data.tableName)));
    Socket.emit("fetchPlanXChannel" , JSON.stringify(await db.getAllEntities(data.tableName)));
    Socket.emit("fetchSensorLog" , JSON.stringify(await db.getAllEntities(data.tableName)));
    Socket.emit("fetchIrrigationLog" , JSON.stringify(await db.getAllEntities(data.tableName)));
  });
});
  







// Database

app.use(express.urlencoded({extended: false}));

app.use(express.json());



server.listen(port, error => {

  if (error) {

      console.log('★ Something went wrong ', error)

  } else {

      console.log('★ Server is listening on port ' + port)

  }

})
